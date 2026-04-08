using backend.Dtos;
using backend.Enums;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TransactionController(
    ITransactionService _transactionService,
    ICurrentUserService _currentUserService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddTransactionDto value)
    {
        var email = _currentUserService.Email;

        var transaction = new Transaction
        {
            Email = email,
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
        var email = _currentUserService.Email;

        var expensesBreakdown = new Dictionary<string, double>();
        var expenses = 0.00;
        var income = 0.00;

        var transactions = await _transactionService.GetLastDays(email, 30);

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

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] TransactionQueryParameters query)
    {
        var email = _currentUserService.Email;
        var (transactions, count) = await _transactionService.GetAll(email, query);
        var dto = transactions.Select(t => t.ToDto());
        return Ok(new
        {
            totalCount = count,
            data = dto
        });
    }
}
