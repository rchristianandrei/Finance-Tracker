using System.Security.Claims;
using backend.Attributes;
using backend.Data;
using backend.Dtos;
using backend.Interfaces;
using backend.Models;
using backend.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    IAuthService _authService,
    IEmailService _emailService,
    IVerifyAccountService _verifyAccountService,
    IJwtService _jwtService,
    JwtSettings _jwtSettings,
    IUserRepo _userRepo
) : ControllerBase
{
    [Transaction]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto value)
    {
        var existingUser = await _userRepo.GetUserByEmail(value.Email);
        if (existingUser != null) return BadRequest("Email already in use");

        var user = new User
        {
            Email = value.Email,
        };

        _authService.CreateUser(user, value.Password);

        await _userRepo.CreateUser(user);

        await SendVerificationLink(user);

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserDto value)
    {
        var user = await _userRepo.GetUserByEmail(value.Email);
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

        var dto = new { Email = user.Email };

        return Ok(dto);
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

        var user = await _userRepo.GetUserByEmail(email);
        if (user == null) return NotFound("User does not exist");

        user.IsVerified = true;
        await _userRepo.UpdateUser(user);

        return Ok("Account Verifed. You may now login");
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var email = HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value ?? throw new UnauthorizedAccessException("No email claim found");

        var user = await _userRepo.GetUserByEmail(email);
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
