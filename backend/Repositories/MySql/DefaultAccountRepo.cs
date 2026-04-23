using backend.Data;
using backend.Interfaces.MySql;
using backend.Models;

namespace backend.Repositories.MySql;

public class DefaultAccountRepo(ApplicationDbContext _context) : IDefaultAccountRepo
{
    public async Task Create(DefaultAccount defaultAccount)
    {
        await _context.DefaultAccounts.AddAsync(defaultAccount);
        await _context.SaveChangesAsync();
    }

    public async Task<DefaultAccount?> GetById(int id)
    {
        return await _context.DefaultAccounts.FindAsync(id);
    }

    public async Task Update(DefaultAccount defaultAccount)
    {
        _context.DefaultAccounts.Update(defaultAccount);
        await _context.SaveChangesAsync();
    }
}
