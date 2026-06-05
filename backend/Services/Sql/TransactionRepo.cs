using backend.Data;
using backend.Dtos.Transaction;
using backend.Interfaces.Sql;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Sql;

public class TransactionRepo(ApplicationDbContext _context) : ITransactionRepo
{
    public async Task Create(Transaction transaction)
    {
        await _context.Transactions.AddAsync(transaction);
        await _context.SaveChangesAsync();
    }

    public async Task Update(Transaction transaction)
    {
        _context.Transactions.Update(transaction);
        await _context.SaveChangesAsync();
    }

    public async Task<int> GetCountByCategoryId(int categoryId)
    {
        return await _context.Transactions.CountAsync(t => t.CategoryId == categoryId);
    }

    public async Task<Transaction?> GetById(long id)
    {
        return await _context.Transactions.Include(t => t.Category).AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<(IEnumerable<Transaction> Transactions, long count)> GetAll(int accountId, TransactionQueryParameters query)
    {
        var queryable = _context.Transactions.Include(t => t.Category).Where(t => t.AccountId == accountId);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            queryable = queryable.Where(t => EF.Functions.ILike(t.Description, $"%{query.Search}%"));
        }

        if (query.TransactionType != null)
        {
            queryable = queryable.Where(t => t.Type == query.TransactionType);
        }

        if (query.Categories != null && query.Categories.Length > 0)
        {
            queryable = queryable.Where(t => query.Categories.Contains(t.CategoryId.ToString()));
        }

        if (query.StartDate != null)
        {
            queryable = queryable.Where(t => t.Date >= query.StartDate.Value);
        }

        if (query.EndDate != null)
        {
            var end = query.EndDate.Value.AddDays(1).AddTicks(-1);
            queryable = queryable.Where(t => t.Date <= end);
        }

        var count = await queryable.LongCountAsync();

        var transactions = await queryable
            .OrderByDescending(t => t.Date)
            .Skip((query.PageOrDefault - 1) * query.PageSizeOrDefault)
            .Take(query.PageSizeOrDefault)
            .AsNoTracking()
            .ToListAsync();

        return (transactions, count);
    }

    public async Task<IEnumerable<Transaction>> GetLastDays(int accountId, int days)
    {
        var now = DateTime.UtcNow;
        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-days);
        return await _context.Transactions
            .Include(t => t.Category)
            .Where(t =>
                t.AccountId == accountId &&
                t.CreatedAt >= thirtyDaysAgo &&
                t.CreatedAt <= now)
            .OrderByDescending(t => t.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task Delete(Transaction transaction)
    {
        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
    }
}
