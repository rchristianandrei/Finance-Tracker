using backend.Interfaces;
using backend.Interfaces.Caching;
using backend.Interfaces.MySql;
using backend.Models;

namespace backend.Repositories.Caching;

public class UserCache(
    IUserRepo _userRepo,
    ICacheService _cacheService
) : IUserCache
{
    private static string ModifyKey(int key) => $"user:{key}";
    private readonly static TimeSpan TTL = TimeSpan.FromMinutes(5);

    public async Task<User?> GetById(int id)
    {
        var cached = await _cacheService.GetAsync<User>(ModifyKey(id));
        if (cached != null) return cached;

        var user = await _userRepo.GetById(id);
        if (user != null) await _cacheService.SetAsync(ModifyKey(id), user, TTL);

        return user;
    }

    public async Task Create(User user)
    {
        await _userRepo.Create(user);
        await _cacheService.SetAsync(ModifyKey(user.Id), user, TTL);
    }

    public async Task Update(User user)
    {
        await _userRepo.Update(user);
        await _cacheService.SetAsync(ModifyKey(user.Id), user, TTL);
    }
}
