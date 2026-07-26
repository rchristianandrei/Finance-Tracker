using backend.Data;
using backend.Interfaces.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController(ApplicationDbContext _context, ICurrentUserService _currentUserService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var id = _currentUserService.Id();

        var accounts = await _context.Accounts.Where(a => a.UserId == id).ToListAsync();

        return Ok(accounts.Select(a => new { a.Id, a.Name, a.Balance, a.CreatedAt, a.UserId }));
    }
}
