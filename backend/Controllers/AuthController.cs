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

        var verify = await _verifyAccountRepo.Create(localCredentials.Email); ;

        await _emailService.SendVerifyAccountLink(dto.Email, verify.Otp);

        return Ok(new { verify.Token });
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
            var verify = await _verifyAccountRepo.GetByEmail(dto.Email);
            var isExpired = false;

            if (verify == null)
                verify = await _verifyAccountRepo.Create(dto.Email);
            else
            {
                isExpired = (verify.ExpiresAt - DateTime.UtcNow).Seconds <= 0;
                if (isExpired) await _verifyAccountRepo.RenewOtp(verify);
            }

            if (isExpired) await _emailService.SendVerifyAccountLink(dto.Email, verify.Otp);

            return StatusCode(StatusCodes.Status403Forbidden, new
            {
                message = "Account not verified",
                token = verify.Token
            });
        }

        var authToken = _jwtService.GenerateToken(user);
        _authCookiesService.AttachAuthCookies(authToken);

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

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        _authCookiesService.RemoveAuthCookies();
        return Ok();
    }

    [HttpPut("renew-otp/{token}")]
    public async Task<IActionResult> RenewVerification(string token)
    {
        var verify = await _verifyAccountRepo.GetByToken(token);

        if (verify == null)
            verify = await _verifyAccountRepo.Create(token);
        else
        {
            var isExpired = (verify.ExpiresAt - DateTime.UtcNow).Seconds <= 0;
            if (!isExpired) return Conflict("OTP not yet expired");
            await _verifyAccountRepo.RenewOtp(verify);
        }

        await _emailService.SendVerifyAccountLink(verify.Email, verify.Otp);
        return Ok(new { ExpiresAt = verify.ExpiresAt.ToUniversalTime() });
    }

    [HttpPut("verify-account")]
    public async Task<IActionResult> VerifyAccount([FromBody] VerifyAccountDto dto)
    {
        var verify = await _verifyAccountRepo.GetByToken(dto.Token);
        if (verify == null) return BadRequest("Invalid Token");

        if (verify.Otp != dto.Otp) return BadRequest("Invalid OTP");

        var localCredentials = await _localCredRepo.GetByEmail(verify.Email);
        if (localCredentials == null) return NotFound("Account do not exist");

        localCredentials.IsVerified = true;
        await _localCredRepo.Update();

        await _verifyAccountRepo.Delete(verify);

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

    [HttpGet("verify-token/{token}")]
    public async Task<IActionResult> VerifyToken(string token)
    {
        var verify = await _verifyAccountRepo.GetByToken(token);
        if (verify == null) return NotFound();

        return Ok(new { ExpiresAt = verify.ExpiresAt.ToUniversalTime(), Email = MaskEmail(verify.Email) });
    }

    private static string MaskEmail(string email)
    {
        var parts = email.Split('@');
        var local = parts[0];
        var domain = parts[1];

        var masked = local[0] + new string('*', local.Length - 1);
        return $"{masked}@{domain}";
    }
}
