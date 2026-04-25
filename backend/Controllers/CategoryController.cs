using backend.Data;
using backend.Dtos.Category;
using backend.Interfaces.Caching;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController(ApplicationDbContext _context, IAccountCacheService _accountCache) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            var account = await _accountCache.GetById(dto.AccountId);
            if (account == null) return NotFound("Account Not Found");

            var category = new Category
            {
                AccountId = dto.AccountId,
                Type = dto.Type,
                Name = dto.Name,
            };

            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok();
        }
    }
}