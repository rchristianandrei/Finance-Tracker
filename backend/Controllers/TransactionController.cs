using backend.Attributes;
using backend.Dtos.Transaction;
using backend.Enums;
using backend.Interfaces.Sql;
using backend.Interfaces.Utils;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.OpenApi.Reader;
using Sprache;

namespace backend.Controllers;

[Authorize]
[ApiController]
[EnableRateLimiting("per-user")]
[Route("api/[controller]")]
public class TransactionController(
    ITransactionRepo _transactionService,
    ICurrentUserService _currentUserService,
    IAccountRepo _accountRepo,
    ICategoryRepo _categoryRepo
) : ControllerBase
{
    [Transaction]
    [HttpPost()]
    public async Task<IActionResult> Create([FromBody] AddTransactionDto value)
    {
        var id = _currentUserService.Id();

        var account = await _accountRepo.GetById(value.AccountId);
        if (account == null) return NotFound("Account not found");

        account.Balance += value.Type == TransactionType.INCOME ? value.Amount : -value.Amount;
        await _accountRepo.Update(account);

        var ifExists = await _categoryRepo.ExistsByNameAndAccountId(value.Category, account.Id);
        if (!ifExists)
        {
            var category = new Category
            {
                AccountId = account.Id,
                Type = value.Type,
                Name = value.Category,
            };
            await _categoryRepo.Create(category);
        }

        var transaction = new Transaction
        {
            UserId = id,
            AccountId = value.AccountId,
            Type = value.Type,
            Category = value.Category,
            Amount = value.Amount,
            Description = value.Description,
            Date = value.Date,
        };

        await _transactionService.Create(transaction);

        return Ok();
    }

    [Transaction]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateTransactionDto value)
    {
        var userId = _currentUserService.Id();

        var transaction = await _transactionService.GetById(id);
        if (transaction == null) return NotFound();
        if (transaction.UserId != userId) return Forbid();

        var account = await _accountRepo.GetById(transaction.AccountId);
        if (account == null) return NotFound("Account not found");
        switch (value.Type)
        {
            case TransactionType.INCOME:
                account.Balance += value.Amount - transaction.Amount;
                break;
            case TransactionType.EXPENSE:
                account.Balance -= value.Amount - transaction.Amount;
                break;
        }
        await _accountRepo.Update(account);

        transaction.Type = value.Type;
        transaction.Category = value.Category;
        transaction.Description = value.Description;
        transaction.Amount = value.Amount;
        transaction.Date = value.Date;
        transaction.LastUpdated = DateTime.UtcNow;

        await _transactionService.Update(transaction);


        return Ok();
    }

    [Transaction]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var userId = _currentUserService.Id();

        var transaction = await _transactionService.GetById(id);
        if (transaction == null) return NoContent();

        var account = await _accountRepo.GetById(transaction.AccountId);
        if (account == null) return NotFound("Account not found");
        switch (transaction.Type)
        {
            case TransactionType.INCOME:
                account.Balance -= transaction.Amount;
                break;
            case TransactionType.EXPENSE:
                account.Balance += transaction.Amount;
                break;
        }
        await _accountRepo.Update(account);

        if (transaction.UserId != userId) return Forbid();
        await _transactionService.Delete(transaction);

        return NoContent();
    }
}
