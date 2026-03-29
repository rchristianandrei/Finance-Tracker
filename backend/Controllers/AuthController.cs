using backend.Data;
using backend.Dtos;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(ApplicationDbContext _context, IAuthService _authService) : ControllerBase
{
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

        return Ok();
    }
}
