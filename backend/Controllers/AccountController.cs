using backend.Data;
using backend.Dtos.Account;
using backend.Interfaces.Utils;
using backend.Mappers;
using backend.Models;
using backend.Services.Sql;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController(
    ApplicationDbContext _context,
    ICurrentUserService _currentUserService,
    AccountRepo _accountRepo
) : ControllerBase
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

    [HttpPost("transfer")]
    public async Task<IActionResult> TransferBalance([FromBody] TransferBalanceDto dto)
    {
        if (dto.FromAccountId == dto.ToAccountId) return BadRequest("Cannot transfer to the same account");

        var userId = _currentUserService.Id();

        var fromAccount = await _accountRepo.GetAccountById(dto.FromAccountId);
        if (fromAccount == null) return NotFound("From account not found");
        if (fromAccount.UserId != userId) return Forbid();

        var toAccount = await _accountRepo.GetAccountById(dto.ToAccountId);
        if (toAccount == null) return NotFound("To account not found");
        if (toAccount.UserId != userId) return Forbid();

        fromAccount.Balance -= dto.Amount;
        toAccount.Balance += dto.Amount;

        await _accountRepo.Update(fromAccount);
        await _accountRepo.Update(toAccount);

        await _context.SaveChangesAsync();

        return Ok(fromAccount.ToDto());
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var id = _currentUserService.Id();

        var accounts = await _context.Accounts.Where(a => a.UserId == id).ToListAsync();

        return Ok(accounts.Select(a => a.ToDto()));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAccountDto dto)
    {
        var account = await _accountRepo.GetAccountById(id);
        if (account == null) return NotFound("Account not found");

        var userId = _currentUserService.Id();
        if (account.UserId != userId) return Forbid();

        account.Name = dto.Name;
        account.Balance = dto.InitialBalance;

        await _accountRepo.Update(account);

        return Ok(account.ToDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var account = await _accountRepo.GetAccountById(id);
        if (account == null) return NotFound("Account does not exist");

        var userId = _currentUserService.Id();
        if (account.UserId != userId) return Forbid();

        await _accountRepo.Delete(account);

        return NoContent();
    }
}
