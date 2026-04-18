using backend.Data;
using backend.Interfaces.MySql;
using backend.Models;

namespace backend.Repositories.MySql;

public class AccountRepo(ApplicationDbContext _context) : IAccountRepo
{
    public async Task Create(Account account)
    {
        await _context.Accounts.AddAsync(account);
        await _context.SaveChangesAsync();
    }
}
