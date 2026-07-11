using backend.Attributes;
using backend.Dtos.Account;
using backend.Dtos.Transaction;
using backend.Enums;
using backend.Interfaces.Sql;
using backend.Interfaces.Utils;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[Authorize]
[ApiController]
[EnableRateLimiting("per-user")]
[Route("api/[controller]")]
public class AccountController(
    ICurrentUserService _currentUserService,
    IAccountRepo _accountRepo,
    ICategoryRepo _categoryRepo,
    ITransactionRepo _transactionService
) : ControllerBase
{
    [Transaction]
    [HttpPost]
    public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDto dto)
    {
        var userId = _currentUserService.Id();
        var accounts = await _accountRepo.GetAccounts(userId);
        if (accounts.Count >= 5) return BadRequest("You already have a maximum of 5 accounts");

        var account = new Account
        {
            Name = dto.Name,
            OwnerId = userId
        };
        await _accountRepo.Create(account);

        return Ok(account.ToDto());
    }

    [HttpGet]
    public async Task<IActionResult> GetAccounts()
    {
        var userId = _currentUserService.Id();

        var accounts = await _accountRepo.GetAccounts(userId);
        var dtos = accounts.Select(a => a.ToDto());
        var output = new
        {
            Accounts = dtos
        };

        return Ok(output);
    }

    [HttpGet("{accountId}/categories")]
    public async Task<IActionResult> GetCategories(int accountId)
    {
        var account = await _accountRepo.GetById(accountId);
        if (account == null) return NotFound("Account Not Found");

        var userId = _currentUserService.Id();
        if (account.OwnerId != userId) Forbid();

        var categories = await _categoryRepo.GetByAccountId(accountId);

        return Ok(categories.Select(c => c.ToDto()));
    }

    [HttpGet("{accountId}/transactions")]
    public async Task<IActionResult> Get(int accountId, [FromQuery] TransactionQueryParameters query)
    {
        var (transactions, count) = await _transactionService.GetAll(accountId, query);
        var dto = transactions.Select(t => t.ToDto());
        return Ok(new
        {
            totalCount = count,
            data = dto
        });
    }

    [Transaction]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAccount(int id, [FromBody] UpdateAccountDto dto)
    {
        var userId = _currentUserService.Id();

        var account = await _accountRepo.GetById(id);
        if (account == null) return NotFound();
        if (account.OwnerId != userId) return Forbid();

        account.Name = dto.Name;
        await _accountRepo.Update(account);

        return Ok(account.ToDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAccount(int id)
    {
        var userId = _currentUserService.Id();

        var account = await _accountRepo.GetById(id);
        if (account == null) return NotFound();
        if (account.OwnerId != userId) return Forbid();

        await _accountRepo.Delete(account);

        return Ok();
    }
}
