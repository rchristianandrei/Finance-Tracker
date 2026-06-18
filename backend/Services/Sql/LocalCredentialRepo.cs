using backend.Data;
using backend.Interfaces.Sql;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Sql;

public class LocalCredentialRepo(ApplicationDbContext _context) : ILocalCredentialRepo
{
    public async Task Create(LocalCredential local)
    {
        await _context.LocalCredentials.AddAsync(local);
        await _context.SaveChangesAsync();
    }

    public async Task<LocalCredential?> GetByEmail(string email)
    {
        return await _context.LocalCredentials.FirstOrDefaultAsync(l => l.Email == email);
    }

    public async Task Update()
    {
        await _context.SaveChangesAsync();
    }
}
