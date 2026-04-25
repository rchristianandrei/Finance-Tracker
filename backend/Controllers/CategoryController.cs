using backend.Data;
using backend.Dtos.Category;
using backend.Enums;
using backend.Interfaces;
using backend.Interfaces.Caching;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CategoryController(ApplicationDbContext _context, ICurrentUserService _currentUser, IAccountCacheService _accountCache) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var userId = _currentUser.Id();
        var account = await _accountCache.GetById(dto.AccountId);
        if (account == null) return NotFound("Account Not Found");
        if (account.OwnerId != userId) Forbid();

        var category = new Category
        {
            AccountId = dto.AccountId,
            Type = dto.Type,
            Name = dto.Name,
        };

        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();

        return Ok(category.ToDto());
    }

    [HttpGet("{accountId}")]
    public async Task<IActionResult> GetAll(int accountId)
    {
        var userId = _currentUser.Id();
        var account = await _accountCache.GetById(accountId);
        if (account == null) return NotFound("Account Not Found");
        if (account.OwnerId != userId) Forbid();

        var categories = await _context.Categories.Where(c => c.AccountId == accountId).OrderBy(c => c.Name).ToListAsync();

        var dict = categories
            .GroupBy(c => c.Type)
            .ToDictionary(g => g.Key, g => g.Select(g => g.ToDto())
            .ToList());

        dict.TryGetValue(TransactionType.EXPENSE, out var expense);
        dict.TryGetValue(TransactionType.INCOME, out var income);

        return Ok(new
        {
            Expense = expense,
            Income = income
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Account)
            .AsNoTracking()
            .FirstOrDefaultAsync((c) => c.Id == id);
        if (category == null) return NotFound("Category do not exist");

        var userId = _currentUser.Id();
        if (category.Account.OwnerId != userId) return Forbid();

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
