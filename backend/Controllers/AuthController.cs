using backend.Attributes;
using backend.Data;
using backend.Dtos;
using backend.Interfaces;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

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

        var origin = Request.Headers.Origin.ToString();
        var verificationToken = await _verifyAccountService.GenerateToken(user);

        await _emailService.SendVerifyAccountLink(user.Email, origin, verificationToken);

        return Ok();
    }
}
