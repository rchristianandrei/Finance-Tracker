using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces.Sql;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Sql;

public class RefreshTokenService(ApplicationDbContext db) : IRefreshTokenService
{
    private static readonly TimeSpan Lifetime = TimeSpan.FromDays(30);

    public async Task<string> CreateAsync(int userId)
    {
        var raw = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var hash = Hash(raw);

        db.RefreshTokens.Add(new RefreshToken
        {
            UserId = userId,
            TokenHash = hash,
            ExpiresAt = DateTime.UtcNow.Add(Lifetime)
        });
        await db.SaveChangesAsync();
        return raw;
    }

    public async Task<RefreshToken?> ValidateAsync(string raw)
    {
        var hash = Hash(raw);
        var token = await db.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.TokenHash == hash);

        if (token is null || token.IsRevoked || token.ExpiresAt < DateTime.UtcNow)
            return null;

        return token;
    }

    public async Task RevokeAsync(RefreshToken token)
    {
        token.IsRevoked = true;
        await db.SaveChangesAsync();
    }

    public async Task RevokeAllForUserAsync(int userId)
    {
        await db.RefreshTokens
            .Where(r => r.UserId == userId && !r.IsRevoked)
            .ExecuteUpdateAsync(s => s.SetProperty(r => r.IsRevoked, true));
    }

    private static string Hash(string raw)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(raw));
        return Convert.ToHexString(bytes);
    }
}
