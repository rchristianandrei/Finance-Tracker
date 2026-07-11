using backend.Data;
using backend.Enums;
using backend.Interfaces.Sql;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Sql;

public class CategoryRepo(ApplicationDbContext _context) : ICategoryRepo
{
    public async Task<Category?> IfExists(int userId, TransactionType type, string categoryName)
    {
        return await _context.Categories
            .Where(c => c.UserId == userId && c.Type == type && c.Name == categoryName)
            .AsNoTracking()
            .FirstOrDefaultAsync();
    }

    public async Task Create(Category category)
    {
        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();
    }

    public async Task<Category?> GetById(int id)
    {
        var query = _context.Categories.AsQueryable();

        return await query
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<ICollection<Category>> GetAll(int userId)
    {
        return await _context.Categories
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.Name)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task Update(Category category)
    {
        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
    }

    public async Task Delete(Category category)
    {
        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
    }
}
