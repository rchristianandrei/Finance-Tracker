using backend.Data;
using backend.Interfaces.MySql;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.MySql;

public class AccountRepo(ApplicationDbContext _context) : IAccountRepo
{
    public async Task Create(Account account)
    {
        await _context.Accounts.AddAsync(account);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Account>> GetAccounts(int userId)
    {
        var accounts = await _context.Accounts
            .Where(a => a.OwnerId == userId)
            .ToListAsync();
        return accounts;
    }

    public async Task<List<Account>> GetAccountsAsNoTracking(int userId)
    {
        var accounts = await _context.Accounts
            .Where(a => a.OwnerId == userId)
            .AsNoTracking()
            .ToListAsync();
        return accounts;
    }

    public async Task<Account?> GetById(int id)
    {
        return await _context.Accounts.FindAsync(id);
    }

    public async Task Update(Account account)
    {
        _context.Accounts.Update(account);
        await _context.SaveChangesAsync();
    }

    public async Task Delete(Account account)
    {
        _context.Accounts.Remove(account);
        await _context.SaveChangesAsync();
    }
}
