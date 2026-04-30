using backend.Dtos;
using backend.Enums;
using backend.Interfaces;
using backend.Interfaces.MySql;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Sprache;

namespace backend.Controllers;

[Authorize]
[EnableRateLimiting("per-user")]
[ApiController]
[Route("api/[controller]")]
public class TransactionController(
    ITransactionService _transactionService,
    ICurrentUserService _currentUserService,
    IAccountRepo _accountRepo
) : ControllerBase
{
    [HttpGet("dashboard/{accountId}")]
    public async Task<IActionResult> Dashboard(int accountId)
    {
        var expensesBreakdown = new Dictionary<string, double>();
        var expenses = 0.00;
        var income = 0.00;

        var transactions = await _transactionService.GetLastDays(accountId, 30);

        foreach (var transaction in transactions)
        {
            if (transaction.Type == TransactionType.INCOME)
            {
                income += transaction.Amount;
            }
            else if (transaction.Type == TransactionType.EXPENSE)
            {
                expenses += transaction.Amount;

                if (!expensesBreakdown.ContainsKey(transaction.Category))
                    expensesBreakdown.Add(transaction.Category, 0);

                expensesBreakdown[transaction.Category] += transaction.Amount;
            }
        }

        var transactionDtos = transactions.Select(t => t.ToDto());

        return Ok(new
        {
            Balance = income - expenses,
            Income = income,
            Expenses = expenses,
            ExpensesBreakdown = expensesBreakdown.ToArray(),
            Transactions = transactionDtos
        });
    }

    [HttpGet("{accountId}")]
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

    [HttpPost("{accountId}")]
    public async Task<IActionResult> Add(int accountId, [FromBody] AddTransactionDto value)
    {
        var id = _currentUserService.Id();

        var account = await _accountRepo.GetById(accountId);
        if (account == null) return NotFound("Account not found");

        account.Balance += value.Type == TransactionType.INCOME ? value.Amount : -value.Amount;
        await _accountRepo.Update(account);

        var transaction = new Transaction
        {
            UserId = id,
            AccountId = accountId,
            Type = value.Type,
            Category = value.Category,
            Amount = value.Amount,
            Description = value.Description,
            Date = value.Date,
        };

        await _transactionService.Create(transaction);

        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateTransactionDto value)
    {
        var userId = _currentUserService.Id();

        var transaction = await _transactionService.GetById(id);
        if (transaction == null) return NotFound();
        if (transaction.UserId != userId) return Forbid();

        transaction.Type = value.Type;
        transaction.Category = value.Category;
        transaction.Description = value.Description;
        transaction.Amount = value.Amount;
        transaction.Date = value.Date;
        transaction.LastUpdated = DateTime.UtcNow;

        await _transactionService.Update(transaction);

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var userId = _currentUserService.Id();

        var transaction = await _transactionService.GetById(id);
        if (transaction == null) return NoContent();

        if (transaction.UserId != userId) return Forbid();
        await _transactionService.Delete(transaction);

        return NoContent();
    }
}
