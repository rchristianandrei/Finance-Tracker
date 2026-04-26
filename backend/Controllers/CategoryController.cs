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
        // TODO - Add a limit
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

        return Ok(categories.Select(c => c.ToDto()));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
    {
        var category = await _context.Categories.Include(c => c.Account).AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) return NotFound("Category not found");

        var userId = _currentUser.Id();
        if (category.Account.OwnerId != userId) return Forbid();

        category.Type = dto.Type;
        category.Name = dto.Name;

        _context.Categories.Update(category);
        await _context.SaveChangesAsync();

        return Ok(category.ToDto());
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
