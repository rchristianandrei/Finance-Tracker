using backend.Data;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize(Policy = "AdminOnly")]
[ApiController]
[Route("api/[controller]")]
public class UserController(ApplicationDbContext _context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var users = await _context.Users.AsNoTracking().ToListAsync();
        return Ok(users.Select(u => u.ToDto()));
    }
}
