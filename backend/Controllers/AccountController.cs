using backend.Data;
using backend.Dtos.Account;
using backend.Interfaces.Utils;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController(ApplicationDbContext _context, ICurrentUserService _currentUserService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAccountDto dto)
    {
        var userId = _currentUserService.Id();

        var account = new Account
        {
            UserId = userId,
            Name = dto.Name,
            Balance = dto.InitialBalance
        };

        await _context.Accounts.AddAsync(account);
        await _context.SaveChangesAsync();

        return Ok(account.ToDto());
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var id = _currentUserService.Id();

        var accounts = await _context.Accounts.Where(a => a.UserId == id).ToListAsync();

        return Ok(accounts.Select(a => a.ToDto()));
    }
}
