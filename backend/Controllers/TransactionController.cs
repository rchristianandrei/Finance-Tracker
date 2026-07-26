using backend.Attributes;
using backend.Dtos;
using backend.Dtos.Reports;
using backend.Dtos.Transaction;
using backend.Interfaces.Sql;
using backend.Interfaces.Utils;
using backend.Mappers;
using backend.Models;
using backend.Services.Sql;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Sprache;

namespace backend.Controllers;

[Authorize]
[ApiController]
[EnableRateLimiting("per-user")]
[Route("api/[controller]")]
public class TransactionController(
    ITransactionRepo _transactionService,
    ICurrentUserService _currentUserService,
    AccountRepo _accountRepo,
    ICategoryRepo _categoryRepo
) : ControllerBase
{
    [Transaction]
    [HttpPost()]
    public async Task<IActionResult> Create([FromBody] AddTransactionDto value)
    {
        var userId = _currentUserService.Id();

        var account = await _accountRepo.GetAccountById(value.AccountId);
        if (account == null) return BadRequest("Account does not exist");
        if (account.UserId != userId) return Forbid();

        var category = await _categoryRepo.GetById(value.CategoryId);
        if (category == null) return BadRequest("Category does not exist");
        if (category.UserId != userId) return Forbid();

        // Update Associated Account Balance
        if (category.Type == Enums.TransactionType.INCOME)
        {
            account.Balance += value.Amount;
        }
        else
        {
            account.Balance -= value.Amount;
        }

        var transaction = new Transaction
        {
            AccountId = account.Id,
            UserId = userId,
            CategoryId = category.Id,
            Amount = value.Amount,
            Description = value.Description,
            Date = value.Date,
        };

        await _transactionService.Create(transaction);

        transaction.Category = category;
        return Ok(transaction.ToDto());
    }

    [HttpGet()]
    public async Task<IActionResult> GetAll([FromQuery] TransactionQueryParameters query)
    {
        var userId = _currentUserService.Id();
        var (transactions, count) = await _transactionService.GetAll(userId, query);
        var dto = transactions.Select(t => t.ToDto());
        return Ok(new
        {
            totalCount = count,
            data = dto
        });
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard([FromQuery] DashboardQueryParams query)
    {
        var userId = _currentUserService.Id();

        var transactions = await _transactionService.GetDashboard(userId, query);
        var accounts = await _accountRepo.GetAccountsByUserId(userId);

        var totalIncome = transactions
            .Where(x => x.Category.Type == Enums.TransactionType.INCOME)
            .Sum(x => x.Amount);

        var totalExpense = transactions
            .Where(x => x.Category.Type == Enums.TransactionType.EXPENSE)
            .Sum(x => x.Amount);

        var netAmount = totalIncome - totalExpense;

        var dashboard = new DashboardDto
        {
            TotalIncome = totalIncome,
            TotalExpense = totalExpense,
            NetAmount = netAmount,
            IncomeByCategory = [.. transactions
                .Where(x => x.Category.Type == Enums.TransactionType.INCOME)
                .GroupBy(x => new
                {
                    x.Category.Id,
                    x.Category.Name
                })
                .Select(g => new CategoryAmountDto
                {
                    Category = g.Key.Name,
                    Amount = g.Sum(x => x.Amount),
                    Percentage = totalIncome > 0 ? g.Sum(x => x.Amount) / totalIncome * 100 : 0
                })],
            ExpenseByCategory = [.. transactions
                .Where(x => x.Category.Type == Enums.TransactionType.EXPENSE)
                .GroupBy(x => new
                {
                    x.Category.Id,
                    x.Category.Name
                })
                .Select(g => new CategoryAmountDto
                {
                    Category = g.Key.Name,
                    Amount = g.Sum(x => x.Amount),
                    Percentage = totalExpense > 0 ? g.Sum(x => x.Amount) / totalExpense * 100 : 0
                })],
            Accounts = accounts.Select(a => a.ToDto())
        };

        return Ok(dashboard);
    }

    [Transaction]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateTransactionDto value)
    {
        var userId = _currentUserService.Id();

        var transaction = await _transactionService.GetById(id);
        if (transaction == null) return NotFound();
        if (transaction.UserId != userId) return Forbid();

        var account = await _accountRepo.GetAccountById(value.AccountId);
        if (account == null) return BadRequest("Account does not exist");
        if (account.UserId != userId) return Forbid();

        var category = await _categoryRepo.GetById(value.CategoryId);
        if (category == null) return BadRequest("Category does not exist");
        if (category.UserId != userId) return Forbid();

        // Update Associated Account Balance
        if (transaction.Category.Type == Enums.TransactionType.INCOME)
        {
            account.Balance -= transaction.Amount;
        }
        else
        {
            account.Balance += transaction.Amount;
        }

        if (category.Type == Enums.TransactionType.INCOME)
        {
            account.Balance += value.Amount;
        }
        else
        {
            account.Balance -= value.Amount;
        }

        transaction.Category = category;
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

        if (transaction.UserId != userId) return Forbid();
        await _transactionService.Delete(transaction);

        return NoContent();
    }
}
