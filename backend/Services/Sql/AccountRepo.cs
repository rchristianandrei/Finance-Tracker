using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Sql;

public class AccountRepo(ApplicationDbContext _context)
{
    public async Task Create(Account account)
    {
        await _context.Accounts.AddAsync(account);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Account>> GetAccountsByUserId(int userId)
    {
        return await _context.Accounts.Where(a => a.UserId == userId).ToListAsync();
    }
}
