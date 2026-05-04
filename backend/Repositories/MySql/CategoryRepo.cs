using backend.Data;
using backend.Enums;
using backend.Interfaces.MySql;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.MySql;

public class CategoryRepo(ApplicationDbContext _context) : ICategoryRepo
{
    public async Task<bool> ExistsByNameAndAccountId(string categoryName, int accountId)
    {
        return await _context.Categories.AnyAsync(c => c.AccountId == accountId && c.Name == categoryName);
    }

    public async Task Create(Category category)
    {
        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();
    }

    public async Task<Category?> GetById(int id, bool includeAccount = false)
    {
        var query = _context.Categories.AsQueryable();

        if (includeAccount) query = query.Include(c => c.Account);

        return await query
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<ICollection<Category>> GetByAccountId(int accountId)
    {
        return await _context.Categories
            .Where(c => c.AccountId == accountId)
            .OrderBy(c => c.Name)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<int> GetCountByAccountIdAndType(int accountId, TransactionType type)
    {
        return await _context.Categories
            .Where(c => c.AccountId == accountId && c.Type == type)
            .AsNoTracking().CountAsync();
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
