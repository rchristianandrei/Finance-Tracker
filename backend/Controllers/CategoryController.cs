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
    ITransactionRepo _transactionRepo
) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var userId = _currentUser.Id();

        var category = await _categoryRepo.IfExists(userId, dto.Type, dto.Name);
        if (category != null) return BadRequest("Existing Category");

        var newCategory = new Category
        {
            UserId = userId,
            Type = dto.Type,
            Name = dto.Name,
        };

        await _categoryRepo.Create(newCategory);

        return Ok(newCategory.ToDto());
    }

    [HttpGet()]
    public async Task<IActionResult> GetAll()
    {
        var userId = _currentUser.Id();
        var categories = await _categoryRepo.GetAll(userId);

        return Ok(categories.Select(c => c.ToDto()));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
    {
        var category = await _categoryRepo.GetById(id);
        if (category == null) return NotFound("Category not found");

        var userId = _currentUser.Id();
        if (category.User.Id != userId) return Forbid();

        var ifCategoryNameExists = await _categoryRepo.IfExists(userId, dto.Type, dto.Name);
        if (ifCategoryNameExists != null) return BadRequest("Existing Category");

        category.Type = dto.Type;
        category.Name = dto.Name;

        await _categoryRepo.Update(category);

        return Ok(category.ToDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _categoryRepo.GetById(id);
        if (category == null) return NotFound("Category do not exist");

        var userId = _currentUser.Id();
        if (category.User.Id != userId) return Forbid();

        var transactionCount = await _transactionRepo.GetCountByCategoryId(category.Id);
        if (transactionCount > 0) return BadRequest("You cannot delete a category with transactions");

        await _categoryRepo.Delete(category);

        return NoContent();
    }
}
