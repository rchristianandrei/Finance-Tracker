using backend.Dtos;
using backend.Enums;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var transactions = await _transactionService.GetAll();
        return Ok(transactions);
    }
}
