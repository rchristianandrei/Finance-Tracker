using System.Security.Claims;
using backend.Attributes;
using backend.Data;
using backend.Dtos;
using backend.Interfaces;
using backend.Models;
using backend.Settings;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[EnableRateLimiting("fixed")]
[Route("api/[controller]")]
public class AuthController(
    IConfiguration _config,
    IAuthService _authService,
    IEmailService _emailService,
    IVerifyAccountService _verifyAccountService,
    IJwtService _jwtService,
    JwtSettings _jwtSettings,
    IUserCacheService _userCache,
    ICurrentUserService _currentUserService
) : ControllerBase
{
    [Transaction]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto value)
    {
        var existingUser = await _userCache.GetById(value.Email);
        if (existingUser != null) return BadRequest("Email already in use");

        var user = new User
        {
            Email = value.Email,
        };

        _authService.CreateUser(user, value.Password);

        await _userCache.Create(user);

        await SendVerificationLink(user);

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserDto value)
    {
        var user = await _userCache.GetById(value.Email);
        if (user == null) return BadRequest("Invalid Credentials");

        var correctPassword = _authService.VerifyPassword(user, value.Password);
        if (!correctPassword) return BadRequest("Invalid Credentials");

        if (!user.IsVerified)
        {
            await SendVerificationLink(user);
            return BadRequest("User not verified. Please check your email");
        }

        var token = _jwtService.GenerateToken(user);

        Response.Cookies.Append("Authorization", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(Convert.ToInt32(_jwtSettings.ExpireMinutes))
        });

        return Ok(new { email = user.Email });
    }

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

            var user = await _userCache.GetById(payload.Email);
            if (user == null) return BadRequest("Invalid Credentials");

            var token = _jwtService.GenerateToken(user);

            Response.Cookies.Append("Authorization", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToInt32(_jwtSettings.ExpireMinutes))
            });

            return Ok(new { email = user.Email });
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
        Response.Cookies.Append("Authorization", "", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(-1)
        });

        return Ok();
    }

    [HttpGet("verify-account/{token}")]
    public async Task<IActionResult> VerifyAccount(string token)
    {
        var email = await _verifyAccountService.GetUserEmailByToken(token);
        if (email == null) return BadRequest("Invalid Token. Please try logging in again");

        var user = await _userCache.GetById(email);
        if (user == null) return NotFound("User does not exist");

        user.IsVerified = true;
        await _userCache.Update(user);

        return Ok("Account Verifed. You may now login");
    }

    [Authorize]
    [EnableRateLimiting("per-user")]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var email = _currentUserService.Email;

        var user = await _userCache.GetById(email);
        if (user == null) return Unauthorized();

        var dto = new { Email = user.Email };

        return Ok(dto);
    }

    private async Task SendVerificationLink(User user)
    {
        var request = HttpContext.Request;
        var host = $"{request.Scheme}://{request.Host}";
        var verificationToken = await _verifyAccountService.GenerateToken(user);
        await _emailService.SendVerifyAccountLink(user.Email, host, verificationToken);
    }
}
