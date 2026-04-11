using backend.Data;
using backend.Interfaces.MySql;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.MySql;

public class GoogleCredentialRepo(ApplicationDbContext _context) : IGoogleCredentialRepo
{
    public async Task<GoogleCredential?> GetBySub(string sub)
    {
        return await _context.GoogleCredentials.FirstOrDefaultAsync(g => g.Subject == sub);
    }

    public async Task Create(GoogleCredential googleCreds)
    {
        await _context.GoogleCredentials.AddAsync(googleCreds);
        await _context.SaveChangesAsync();
    }
}
