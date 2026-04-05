using backend.Dtos;
using backend.Enums;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharpCompress.Common;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TransactionController(TransactionService _transactionService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddTransactionDto value)
    {
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

        var transaction = new Transaction
        {
            Email = email!,
            Type = value.Type,
            Category = value.Category,
            Amount = value.Amount,
            Description = value.Description,
            CreatedAt = value.Date,
            LastUpdated = value.Date
        };

        await _transactionService.Create(transaction);

        return Ok();
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var expensesBreakdown = new Dictionary<string, double>();
        var expenses = 0.00;
        var income = 0.00;

        var transactions = await _transactionService.GetLastDays(30);

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

        var transactionDtos = transactions.Select(t => new
        {
            Date = t.CreatedAt,
            Type = t.Type.ToString(),
            Category = t.Category,
            Description = t.Description,
            Amount = t.Amount
        });

        return Ok(new
        {
            Balance = income - expenses,
            Income = income,
            Expenses = expenses,
            ExpensesBreakdown = expensesBreakdown.ToArray(),
            Transactions = transactionDtos
        });
    }
}
