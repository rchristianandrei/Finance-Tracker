using backend.Dtos.Category;
using backend.Interfaces.Sql;
using backend.Interfaces.Utils;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[Authorize]
[ApiController]
[EnableRateLimiting("per-user")]
[Route("api/[controller]")]
public class CategoryController(
    ICurrentUserService _currentUser,
    ICategoryRepo _categoryRepo,
    IAccountRepo _accountRepo,
    ITransactionRepo _transactionRepo
) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var userId = _currentUser.Id();
        var account = await _accountRepo.GetById(dto.AccountId);
        if (account == null) return NotFound("Account Not Found");
        if (account.OwnerId != userId) Forbid();

        var count = await _categoryRepo.GetCountByAccountIdAndType(dto.AccountId, dto.Type);
        if (count >= 10) return BadRequest("You're exceeding the max limit of 10");

        var category = await _categoryRepo.IfExists(dto.Type, dto.Name, dto.AccountId);
        if (category != null) return BadRequest("Existing Category");

        var newCategory = new Category
        {
            AccountId = dto.AccountId,
            Type = dto.Type,
            Name = dto.Name,
        };

        await _categoryRepo.Create(newCategory);

        return Ok(newCategory.ToDto());
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

        var transactionCount = await _transactionRepo.GetCountByAccountId(category.AccountId);
        if (transactionCount > 0) return BadRequest("You cannot delete a category with transactions");

        await _categoryRepo.Delete(category);

        return NoContent();
    }
}
