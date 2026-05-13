using backend.Data;
using backend.Dtos;
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
                EF.Functions.ILike(t.Type.ToString(), search) ||
                EF.Functions.ILike(t.Category, search) ||
                EF.Functions.ILike(t.Description, search)
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
