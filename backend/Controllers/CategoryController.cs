using backend.Data;
using backend.Dtos.Category;
using backend.Interfaces;
using backend.Interfaces.Caching;
using backend.Interfaces.MySql;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CategoryController(
    ICurrentUserService _currentUser,
    ICategoryRepo _categoryRepo,
    IAccountCacheService _accountCache) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var userId = _currentUser.Id();
        var account = await _accountCache.GetById(dto.AccountId);
        if (account == null) return NotFound("Account Not Found");
        if (account.OwnerId != userId) Forbid();

        var count = await _categoryRepo.GetCountByAccountIdAndType(dto.AccountId, dto.Type);
        if (count >= 10) return BadRequest("You're exceeding the max limit of 10");

        var category = new Category
        {
            AccountId = dto.AccountId,
            Type = dto.Type,
            Name = dto.Name,
        };

        await _categoryRepo.Create(category);

        return Ok(category.ToDto());
    }

    [HttpGet("{accountId}")]
    public async Task<IActionResult> GetAll(int accountId)
    {
        var account = await _accountCache.GetById(accountId);
        if (account == null) return NotFound("Account Not Found");

        var userId = _currentUser.Id();
        if (account.OwnerId != userId) Forbid();

        var categories = await _categoryRepo.GetByAccountId(accountId);

        return Ok(categories.Select(c => c.ToDto()));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
    {
        var category = await _categoryRepo.GetById(id, includeAccount: true);
        if (category == null) return NotFound("Category not found");

        var userId = _currentUser.Id();
        if (category.Account.OwnerId != userId) return Forbid();

        category.Type = dto.Type;
        category.Name = dto.Name;

        await _categoryRepo.Update(category);

        return Ok(category.ToDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _categoryRepo.GetById(id, includeAccount: true);
        if (category == null) return NotFound("Category do not exist");

        var userId = _currentUser.Id();
        if (category.Account.OwnerId != userId) return Forbid();

        await _categoryRepo.Delete(category);

        return NoContent();
    }
}
