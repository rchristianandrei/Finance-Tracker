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
            ToAccountId = account.Id,
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

    [Transaction]
    [HttpPost("income")]
    public async Task<IActionResult> CreateIncome([FromBody] CreateIncomeTransactionDto value)
    {
        var userId = _currentUserService.Id();

        var account = await _accountRepo.GetAccountById(value.ToAccountId);
        if (account == null) return BadRequest("To Account does not exist");
        if (account.UserId != userId) return Forbid();

        var category = await _categoryRepo.GetById(value.CategoryId);
        if (category == null) return BadRequest("Category does not exist");
        if (category.UserId != userId) return Forbid();
        if (category.Type != Enums.TransactionType.INCOME) return BadRequest("Category is not an income category");

        account.Balance += value.Amount;

        var transaction = new Transaction
        {
            ToAccountId = account.Id,
            UserId = userId,
            CategoryId = category.Id,
            Amount = value.Amount,
            Description = value.Description,
            Date = value.Date,
        };

        await _transactionService.Create(transaction);

        return Ok();
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

        var newAccount = await _accountRepo.GetAccountById(value.AccountId);
        if (newAccount == null) return BadRequest("Account does not exist");
        if (newAccount.UserId != userId) return Forbid();

        var newCategory = await _categoryRepo.GetById(value.CategoryId);
        if (newCategory == null) return BadRequest("Category does not exist");
        if (newCategory.UserId != userId) return Forbid();

        // Update Old Account
        if (transaction.Category.Type == Enums.TransactionType.INCOME)
        {
            transaction.ToAccount.Balance -= transaction.Amount;
        }
        else
        {
            transaction.ToAccount.Balance += transaction.Amount;
        }

        // New Old Account
        if (newCategory.Type == Enums.TransactionType.INCOME)
        {
            newAccount.Balance += value.Amount;
        }
        else
        {
            newAccount.Balance -= value.Amount;
        }

        transaction.ToAccountId = newAccount.Id;
        transaction.CategoryId = newCategory.Id;
        transaction.Description = value.Description;
        transaction.Amount = value.Amount;
        transaction.Date = value.Date;
        transaction.LastUpdated = DateTime.UtcNow;

        await _transactionService.Update(transaction);

        return Ok();
    }

    [Transaction]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id, [FromQuery] bool updateAccountBalance)
    {
        var userId = _currentUserService.Id();

        var transaction = await _transactionService.GetById(id);
        if (transaction == null) return NoContent();
        if (transaction.UserId != userId) return Forbid();

        // Update Account
        if (updateAccountBalance)
        {
            if (transaction.Category.Type == Enums.TransactionType.INCOME)
            {
                transaction.ToAccount.Balance -= transaction.Amount;
            }
            else
            {
                transaction.ToAccount.Balance += transaction.Amount;
            }
        }

        await _transactionService.Delete(transaction);

        return NoContent();
    }
}
