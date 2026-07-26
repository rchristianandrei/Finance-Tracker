using backend.Data;
using backend.Models;

namespace backend.Services.Sql;

public class AccountRepo(ApplicationDbContext _context)
{
    public async Task Create(Account account)
    {
        await _context.Accounts.AddAsync(account);
        await _context.SaveChangesAsync();
    }
}
