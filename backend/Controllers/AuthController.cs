using backend.Attributes;
using backend.Data;
using backend.Dtos;
using backend.Interfaces;
using backend.Interfaces.Caching;
using backend.Interfaces.MySql;
using backend.Interfaces.Utils;
using backend.Models;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[EnableRateLimiting("fixed")]
[Route("api/[controller]")]
public class AuthController(
    IUserCache _userCache,
    IGoogleCredentialRepo _googleCredRepo,
    ILocalCredentialRepo _localCredRepo,
    IVerifyAccountRepo _verifyAccountRepo,
    IConfiguration _config,
    IPasswordService _authService,
    IJwtService _jwtService,
    ICurrentUserService _currentUserService,
    IAuthCookiesService _authCookiesService,
    IEmailService _emailService
) : ControllerBase
{
    [Transaction]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
    {
        var existingLocalCred = await _localCredRepo.GetByEmail(dto.Email);
        if (existingLocalCred != null) return BadRequest("Email already in use");

        // Create User
        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName
        };
        await _userCache.Create(user);

        //  Create Credentials
        var localCredentials = new LocalCredential
        {
            UserId = user.Id,
            Email = dto.Email
        };
        _authService.HashPassword(localCredentials, dto.Password);
        await _localCredRepo.Create(localCredentials);

        var (token, otp) = await _verifyAccountRepo.Create(localCredentials.Email); ;

        await _emailService.SendVerifyAccountLink(dto.Email, otp);

        return Ok(new { token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserDto dto)
    {
        var localCreds = await _localCredRepo.GetByEmail(dto.Email);
        if (localCreds == null) return BadRequest("Invalid Credentials");

        var correctPassword = _authService.VerifyPassword(localCreds, dto.Password);
        if (!correctPassword) return BadRequest("Invalid Credentials");

        var user = await _userCache.GetById(localCreds.UserId);
        if (user == null) return Unauthorized();

        if (!localCreds.IsVerified)
        {
            return BadRequest("User not verified. Please check your email");
        }

        var token = _jwtService.GenerateToken(user);
        _authCookiesService.AttachAuthCookies(token);

        return Ok(new { user.Id, user.FirstName, user.LastName });
    }

    [Transaction]
    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [_config["Google:ClientId"]]
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);

            var existingAcc = await _googleCredRepo.GetBySub(payload.Subject);
            User? user;

            if (existingAcc == null)
            {
                // Create User  
                user = new User
                {
                    FirstName = payload.GivenName,
                    LastName = payload.FamilyName
                };
                await _userCache.Create(user);

                // Create AuthProvider
                var sub = payload.Subject;
                var googleCreds = new GoogleCredential
                {
                    UserId = user.Id,
                    Email = payload.Email,
                    Subject = payload.Subject
                };
                await _googleCredRepo.Create(googleCreds);
            }
            else
            {
                user = await _userCache.GetById(existingAcc.UserId);
            }

            if (user == null) return BadRequest("User does not exists");

            var token = _jwtService.GenerateToken(user);
            _authCookiesService.AttachAuthCookies(token);

            return Ok(new { user.Id, user.FirstName, user.LastName });
        }
        catch (InvalidJwtException)
        {
            return Unauthorized("Invalid Google token.");
        }
    }

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        _authCookiesService.RemoveAuthCookies();
        return Ok();
    }

    [Authorize]
    [EnableRateLimiting("per-user")]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var id = _currentUserService.Id();

        var user = await _userCache.GetById(id);
        if (user == null) return Unauthorized();

        var dto = new { user.Id, user.FirstName, user.LastName };

        return Ok(dto);
    }
}
