using System.Security.Cryptography;
using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class VerifyAccountService(ICacheService _cache) : IVerifyAccountService
{
    private readonly TimeSpan _expiry = TimeSpan.FromMinutes(5);

    public async Task<string> GenerateToken(User user)
    {
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

        await _cache.SetAsync(ModifyKey(token), user.Email, _expiry);

        return token;
    }

    public async Task<string?> GetUserEmailByToken(string token)
    {
        return await _cache.GetAsync<string>(ModifyKey(token));
    }

    public string ModifyKey(string key) => $"verify-account:{key}";
}
