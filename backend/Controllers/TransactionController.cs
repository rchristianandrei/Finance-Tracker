using backend.Attributes;
using backend.Dtos;
using backend.Dtos.Transaction;
using backend.Interfaces.Sql;
using backend.Interfaces.Utils;
using backend.Mappers;
using backend.Models;
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
    ICategoryRepo _categoryRepo
) : ControllerBase
{
    [Transaction]
    [HttpPost()]
    public async Task<IActionResult> Create([FromBody] AddTransactionDto value)
    {
        var id = _currentUserService.Id();

        var category = await _categoryRepo.GetById(value.CategoryId);
        if (category == null) return BadRequest("Category does not exist");
        if (category.UserId != id) return Forbid();

        var transaction = new Transaction
        {
            UserId = id,
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
        var dashboardData = await _transactionService.GetDashboard(userId, query);
        return Ok(dashboardData);
    }

    [Transaction]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateTransactionDto value)
    {
        var userId = _currentUserService.Id();

        var transaction = await _transactionService.GetById(id);
        if (transaction == null) return NotFound();
        if (transaction.UserId != userId) return Forbid();

        var category = await _categoryRepo.GetById(value.CategoryId);
        if (category == null) return BadRequest("Category does not exist");
        if (category.UserId != userId) return Forbid();

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
