using System.Security.Cryptography;
using backend.Interfaces;

namespace backend.Services;

public class OtpService(ICacheService _cache) : IOtpService
{
    private readonly TimeSpan _expiry = TimeSpan.FromMinutes(5);

    public string GenerateOtp(string key)
    {
        var otp = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

        _cache.SetAsync(ModifyKey(key), otp, _expiry);

        return otp;
    }

    public async Task<string?> GetOtp(string key)
    {
        return await _cache.GetAsync<string>(ModifyKey(key));
    }

    public async Task RemoveOtp(string key)
    {
        await _cache.RemoveAsync(ModifyKey(key));
    }

    public string ModifyKey(string key) => $"otp:{key}";
}
