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
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[EnableRateLimiting("fixed")]
[Route("api/[controller]")]
public class AuthController(
    ApplicationDbContext _context,
    IConfiguration _config,
    IAuthService _authService,
    IVerifyAccountService _verifyAccountService,
    IJwtService _jwtService,
    JwtSettings _jwtSettings,
    IUserCacheService _userCache,
    ICurrentUserService _currentUserService
) : ControllerBase
{
    [Transaction]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
    {
        var existingLocalCred = await _context.LocalCredentials.FirstOrDefaultAsync(l => l.Email == dto.Email);
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
        _authService.CreateUser(localCredentials, dto.Password);

        await SendVerificationLink(user);

        return Ok();
    }

    // [HttpPost("login")]
    // public async Task<IActionResult> Login([FromBody] LoginUserDto value)
    // {
    //     var user = await _userCache.GetById(value.Email);
    //     if (user == null) return BadRequest("Invalid Credentials");

    //     var correctPassword = _authService.VerifyPassword(user, value.Password);
    //     if (!correctPassword) return BadRequest("Invalid Credentials");

    //     if (!user.IsVerified)
    //     {
    //         await SendVerificationLink(user);
    //         return BadRequest("User not verified. Please check your email");
    //     }

    //     var token = _jwtService.GenerateToken(user);

    //     Response.Cookies.Append("Authorization", token, new CookieOptions
    //     {
    //         HttpOnly = true,
    //         Secure = true,
    //         SameSite = SameSiteMode.None,
    //         Expires = DateTime.UtcNow.AddMinutes(Convert.ToInt32(_jwtSettings.ExpireMinutes))
    //     });

    //     return Ok(new { email = user.Email });
    // }

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

            var existingAcc = await _context.GoogleCredentials.FirstOrDefaultAsync(g => g.Subject == payload.Subject);
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
                await _context.GoogleCredentials.AddAsync(googleCreds);
                await _context.SaveChangesAsync();
            }
            else
            {
                user = await _context.Users.FindAsync(existingAcc.UserId);
            }

            if (user == null) return BadRequest("User does not exists");

            var token = _jwtService.GenerateToken(user);
            Response.Cookies.Append("Authorization", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToInt32(_jwtSettings.ExpireMinutes))
            });

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
        Response.Cookies.Append("Authorization", "", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(-1)
        });

        return Ok();
    }

    [Authorize]
    [EnableRateLimiting("per-user")]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var id = _currentUserService.Id();

        var user = await _context.Users.FindAsync(id);
        if (user == null) return Unauthorized();

        var dto = new { user.Id, user.FirstName, user.LastName };

        return Ok(dto);
    }

    private async Task SendVerificationLink(User user)
    {
        var request = HttpContext.Request;
        var host = $"{request.Scheme}://{request.Host}";
        var verificationToken = await _verifyAccountService.GenerateToken(user);
        // await _emailService.SendVerifyAccountLink(user.Email, host, verificationToken);
    }
}
