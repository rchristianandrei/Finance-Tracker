using backend.Data;
using backend.Dtos;
using backend.Interfaces.MySql;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

namespace backend.Repositories.MySql;

public class TransactionService(ApplicationDbContext _context) : ITransactionService
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

    public async Task<Transaction?> GetById(long id)
    {
        return await _context.Transactions.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<(IEnumerable<Transaction> Transactions, long count)> GetAll(int accountId, QueryParameters query)
    {
        var queryable = _context.Transactions.Where(t => t.AccountId == accountId);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = $"%{query.Search}%";

            queryable = queryable.Where(t =>
                t.Type.ToString().Contains(query.Search) ||
                t.Category.Contains(query.Search) ||
                t.Description.Contains(query.Search)
            );
        }

        if (query.StartDate.HasValue)
        {
            queryable = queryable.Where(t => t.CreatedAt >= query.StartDate.Value);
        }

        if (query.EndDate.HasValue)
        {
            var end = query.EndDate.Value.AddDays(1).AddTicks(-1);
            queryable = queryable.Where(t => t.CreatedAt <= end);
        }

        var count = await queryable.LongCountAsync();

        var transactions = await queryable
            .OrderByDescending(t => t.CreatedAt)
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
