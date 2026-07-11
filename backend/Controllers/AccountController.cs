using backend.Dtos.Transaction;
using backend.Interfaces.Sql;
using backend.Interfaces.Utils;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[Authorize]
[ApiController]
[EnableRateLimiting("per-user")]
[Route("api/[controller]")]
public class AccountController(
    ICurrentUserService _currentUserService,
    ICategoryRepo _categoryRepo,
    ITransactionRepo _transactionService
) : ControllerBase
{
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var userId = _currentUserService.Id();
        var categories = await _categoryRepo.GetAll(userId);

        return Ok(categories.Select(c => c.ToDto()));
    }

    [HttpGet("transactions")]
    public async Task<IActionResult> Get([FromQuery] TransactionQueryParameters query)
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
}
