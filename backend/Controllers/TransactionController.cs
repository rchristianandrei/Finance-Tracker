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
    [HttpPost("add-transaction")]
    public async Task<IActionResult> AddTransaction([FromBody] AddTransactionDto value)
    {
        if (!Enum.TryParse(value.Type, out TransactionType type))
            return BadRequest("Invalid Transaction Type");

        var transaction = new Transaction
        {
            Type = type,
            Category = value.Category,
            Amount = value.Amount,
            Description = value.Description,
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
