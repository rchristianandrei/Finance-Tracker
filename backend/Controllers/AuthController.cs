using backend.Attributes;
using backend.Data;
using backend.Dtos;
using backend.Interfaces;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    ApplicationDbContext _context,
    IAuthService _authService,
    IEmailService _emailService,
    VerifyAccountService _verifyAccountService
) : ControllerBase
{
    [Transaction]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto value)
    {
        var existingUser = await _context.Users.FindAsync(value.Email);

        if (existingUser != null) return BadRequest("Email already in use");

        var user = new User
        {
            Email = value.Email,
        };

        _authService.CreateUser(user, value.Password);

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        var request = HttpContext.Request;
        var host = $"{request.Scheme}://{request.Host}";
        var verificationToken = await _verifyAccountService.GenerateToken(user);

        await _emailService.SendVerifyAccountLink(user.Email, host, verificationToken);

        return Ok();
    }

    [HttpGet("verify-account/{token}")]
    public async Task<IActionResult> VerifyAccount(string token)
    {
        var email = await _verifyAccountService.GetUserEmailByToken(token);
        if (email == null) return BadRequest("Invalid Token. Please try logging in again");

        var user = await _context.Users.FindAsync(email);
        if (user == null) return NotFound("User does not exist");

        user.IsVerified = true;
        await _context.SaveChangesAsync();

        return Ok("Account Verifed. You may now login");
    }
}
