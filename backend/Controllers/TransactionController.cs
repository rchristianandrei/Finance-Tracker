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
    [HttpPost("income")]
    public async Task<IActionResult> CreateIncome([FromBody] CreateIncomeTransactionDto dto)
    {
        var userId = _currentUserService.Id();

        var account = await _accountRepo.GetAccountById(dto.ToAccountId);
        if (account == null) return BadRequest("To Account does not exist");
        if (account.UserId != userId) return Forbid();

        var category = await _categoryRepo.GetById(dto.CategoryId);
        if (category == null) return BadRequest("Category does not exist");
        if (category.UserId != userId) return Forbid();
        if (category.Type != Enums.TransactionType.INCOME) return BadRequest("Category is not an income category");

        account.Balance += dto.Amount;

        var transaction = new Transaction
        {
            UserId = userId,
            Type = Enums.TransactionType.INCOME,
            ToAccountId = account.Id,
            CategoryId = category.Id,
            Amount = dto.Amount,
            Description = dto.Description,
            Date = dto.Date,
        };

        await _transactionService.Create(transaction);

        return Ok();
    }

    [Transaction]
    [HttpPost("expense")]
    public async Task<IActionResult> CreateExpense([FromBody] CreateExpenseTransactionDto dto)
    {
        var userId = _currentUserService.Id();

        var account = await _accountRepo.GetAccountById(dto.FromAccountId);
        if (account == null) return BadRequest("From Account does not exist");
        if (account.UserId != userId) return Forbid();

        var category = await _categoryRepo.GetById(dto.CategoryId);
        if (category == null) return BadRequest("Category does not exist");
        if (category.UserId != userId) return Forbid();
        if (category.Type != Enums.TransactionType.EXPENSE) return BadRequest("Category is not an expense category");

        account.Balance -= dto.Amount;

        var transaction = new Transaction
        {
            UserId = userId,
            Type = Enums.TransactionType.EXPENSE,
            FromAccountId = account.Id,
            CategoryId = category.Id,
            Description = dto.Description,
            Amount = dto.Amount,
            Date = dto.Date,
        };

        await _transactionService.Create(transaction);

        return Ok();
    }

    [Transaction]
    [HttpPost("transfer")]
    public async Task<IActionResult> CreateTransfer([FromBody] CreateTransferTransactionDto dto)
    {
        var userId = _currentUserService.Id();

        var fromAccount = await _accountRepo.GetAccountById(dto.FromAccountId);
        if (fromAccount == null) return BadRequest("From Account does not exist");
        if (fromAccount.UserId != userId) return Forbid();

        var toAccount = await _accountRepo.GetAccountById(dto.ToAccountId);
        if (toAccount == null) return BadRequest("To Account does not exist");
        if (toAccount.UserId != userId) return Forbid();

        fromAccount.Balance -= dto.Amount;
        toAccount.Balance += dto.Amount;

        var transaction = new Transaction
        {
            UserId = userId,
            Type = Enums.TransactionType.TRANSFER,
            FromAccountId = fromAccount.Id,
            ToAccountId = toAccount.Id,
            Description = dto.Description,
            Amount = dto.Amount,
            Date = dto.Date,
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
            .Where(x => x.Type == Enums.TransactionType.INCOME)
            .Sum(x => x.Amount);

        var totalExpense = transactions
            .Where(x => x.Type == Enums.TransactionType.EXPENSE)
            .Sum(x => x.Amount);

        var netAmount = totalIncome - totalExpense;

        var dashboard = new DashboardDto
        {
            TotalIncome = totalIncome,
            TotalExpense = totalExpense,
            NetAmount = netAmount,
            IncomeByCategory = [.. transactions
                .Where(x => x.Type == Enums.TransactionType.INCOME)
                .GroupBy(x => new
                {
                    x.Category!.Id,
                    x.Category.Name
                })
                .Select(g => new CategoryAmountDto
                {
                    Category = g.Key.Name,
                    Amount = g.Sum(x => x.Amount),
                    Percentage = totalIncome > 0 ? g.Sum(x => x.Amount) / totalIncome * 100 : 0
                })],
            ExpenseByCategory = [.. transactions
                .Where(x => x.Type == Enums.TransactionType.EXPENSE)
                .GroupBy(x => new
                {
                    x.Category!.Id,
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
        if (transaction.Type == Enums.TransactionType.INCOME)
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
            if (transaction.Type == Enums.TransactionType.INCOME)
            {
                transaction.ToAccount!.Balance -= transaction.Amount;
            }
            else
            {
                transaction.FromAccount!.Balance += transaction.Amount;
            }
        }

        await _transactionService.Delete(transaction);

        return NoContent();
    }
}
