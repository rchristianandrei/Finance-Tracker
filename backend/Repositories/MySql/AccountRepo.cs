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
}
