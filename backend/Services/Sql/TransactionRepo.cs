using backend.Data;
using backend.Dtos;
using backend.Dtos.Reports;
using backend.Dtos.Transaction;
using backend.Interfaces.Sql;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Sql;

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
        var queryable = _context.Transactions.Include(t => t.Category).Where(t => t.Category.AccountId == accountId);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            queryable = queryable.Where(t => EF.Functions.ILike(t.Description, $"%{query.Search}%"));
        }

        if (query.TransactionType != null)
        {
            queryable = queryable.Where(t => t.Category.Type == query.TransactionType);
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

    public async Task<DashboardDto> GetDashboard(int userId, DashboardQueryParams? query = null)
    {
        var queryable = _context.Transactions.Where(t => t.Category.Account.OwnerId == userId);

        if (query?.StartDate is DateTimeOffset startDate)
        {
            queryable = queryable.Where(t => t.Date >= startDate);
        }

        if (query?.EndDate is DateTimeOffset endDate)
        {
            queryable = queryable.Where(t => t.Date <= endDate);
        }

        var transactions = await queryable
            .Select(t => new
            {
                t.Amount,
                t.Category.Type,
                AccountId = t.Category.Account.Id,
                AccountName = t.Category.Account.Name
            })
            .ToListAsync();

        var totalIncome = transactions
            .Where(x => x.Type == Enums.TransactionType.INCOME)
            .Sum(x => x.Amount);

        var totalExpense = transactions
            .Where(x => x.Type == Enums.TransactionType.EXPENSE)
            .Sum(x => x.Amount);

        var netAmount = totalIncome - totalExpense;

        var incomeByAccount = transactions
            .Where(x => x.Type == Enums.TransactionType.INCOME)
            .GroupBy(x => new { x.AccountId, x.AccountName })
            .Select(g => new AccountSummaryDto
            {
                AccountId = g.Key.AccountId,
                AccountName = g.Key.AccountName,
                Amount = g.Sum(x => x.Amount),
                Percentage = totalIncome == 0
                    ? 0
                    : (g.Sum(x => x.Amount) / totalIncome) * 100
            })
            .OrderByDescending(x => x.Amount)
            .ToList();

        var expenseByAccount = transactions
            .Where(x => x.Type == Enums.TransactionType.EXPENSE)
            .GroupBy(x => new { x.AccountId, x.AccountName })
            .Select(g => new AccountSummaryDto
            {
                AccountId = g.Key.AccountId,
                AccountName = g.Key.AccountName,
                Amount = g.Sum(x => x.Amount),
                Percentage = totalExpense == 0
                    ? 0
                    : (g.Sum(x => x.Amount) / totalExpense) * 100
            })
            .OrderByDescending(x => x.Amount)
            .ToList();

        var accountBalances = transactions
            .GroupBy(x => new { x.AccountId, x.AccountName })
            .Select(g => new AccountBalanceDto
            {
                AccountId = g.Key.AccountId,
                AccountName = g.Key.AccountName,

                TotalIncome = g
                    .Where(x => x.Type == Enums.TransactionType.INCOME)
                    .Sum(x => x.Amount),

                TotalExpense = g
                    .Where(x => x.Type == Enums.TransactionType.EXPENSE)
                    .Sum(x => x.Amount)
            })
            .ToList();

        var dashboard = new DashboardDto
        {
            TotalIncome = totalIncome,
            TotalExpense = totalExpense,
            NetAmount = netAmount,

            IncomeByAccount = incomeByAccount,
            ExpenseByAccount = expenseByAccount,

            Accounts = accountBalances
        };

        return dashboard;
    }

    public async Task Delete(Transaction transaction)
    {
        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
    }
}
