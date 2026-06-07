using backend.Attributes;
using backend.Dtos.Auth;
using backend.Interfaces;
using backend.Interfaces.Sql;
using backend.Interfaces.Utils;
using backend.Mappers;
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
    IGoogleCredentialRepo _googleCredRepo,
    IConfiguration _config,
    IJwtService _jwtService,
    IRefreshTokenService _refreshTokenService,
    ICurrentUserService _currentUserService,
    IAuthCookiesService _authCookiesService,
    IUserRepo _userRepo,
    IEmailService _emailService
) : ControllerBase
{
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
                await _userRepo.Create(user);

                // Create AuthProvider
                var sub = payload.Subject;
                var googleCreds = new GoogleCredential
                {
                    UserId = user.Id,
                    Email = payload.Email,
                    Subject = payload.Subject
                };
                await _googleCredRepo.Create(googleCreds);
                _ = _emailService.SendRegisterNotification(user);
            }
            else
            {
                user = await _userRepo.GetById(existingAcc.UserId);
            }

            if (user == null) return BadRequest("User does not exists");
            if (user.Status == Enums.UserStatus.PENDING) return Accepted(new { status = user.Status, message = "Wait for your registration to be approved" });

            var token = _jwtService.GenerateToken(user);
            _authCookiesService.AttachAuthCookies(token);

            var rawRefresh = await _refreshTokenService.CreateAsync(user.Id);
            _authCookiesService.AttachRefreshCookie(rawRefresh);

            return Ok(new { status = user.Status, user = user.ToDto() });
        }
        catch (InvalidJwtException)
        {
            return Unauthorized("Invalid Google token.");
        }
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var raw = _authCookiesService.GetRefreshToken();
        if (!string.IsNullOrEmpty(raw))
        {
            var token = await _refreshTokenService.ValidateAsync(raw);
            if (token is not null) await _refreshTokenService.RevokeAsync(token);
        }
        _authCookiesService.ClearAuthCookies();
        return Ok();
    }

    [Authorize]
    [EnableRateLimiting("per-user")]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var id = _currentUserService.Id();

        var user = await _userRepo.GetById(id);
        if (user == null) return Unauthorized();

        return Ok(user.ToDto());
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var raw = _authCookiesService.GetRefreshToken();
        if (string.IsNullOrEmpty(raw))
            return Unauthorized("No refresh token.");

        var refreshToken = await _refreshTokenService.ValidateAsync(raw);
        if (refreshToken is null)
            return Unauthorized("Invalid or expired refresh token.");

        await _refreshTokenService.RevokeAsync(refreshToken);
        var newRaw = await _refreshTokenService.CreateAsync(refreshToken.UserId);
        _authCookiesService.AttachRefreshCookie(newRaw);

        var newJwt = _jwtService.GenerateToken(refreshToken.User);
        _authCookiesService.AttachAuthCookies(newJwt);

        return Ok(new { status = refreshToken.User.Status, user = refreshToken.User.ToDto() });
    }
}
