using System.Text.Json;
using backend.Interfaces;
using Microsoft.Extensions.Caching.Distributed;

namespace backend.Services;

public class RedisCacheService(IDistributedCache _cache) : ICacheService
{
    public async Task<T?> GetAsync<T>(string key)
    {
        var json = await _cache.GetStringAsync(key);
        return json is null ? default : JsonSerializer.Deserialize<T>(json);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null)
    {
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = expiry ?? TimeSpan.FromMinutes(30)
        };
        await _cache.SetStringAsync(key, JsonSerializer.Serialize(value), options);
    }

    public async Task RemoveAsync(string key) =>
        await _cache.RemoveAsync(key);
}
