using backend.Interfaces;
using backend.Models;

namespace backend.Repositories.Caching;

public class UserCacheService(IUserRepo _userRepo, ICacheService _cacheService) : IUserCacheService
{
    private static string ModifyKey(string key) => $"user:{key}";

    public async Task<User?> GetById(string email)
    {
        var cached = await _cacheService.GetAsync<User>(ModifyKey(email));
        if (cached != null) return cached;

        var user = await _userRepo.GetUserByEmail(email);
        if (user != null) await _cacheService.SetAsync(ModifyKey(email), user);

        return user;
    }

    public async Task Create(User user)
    {
        await _userRepo.CreateUser(user);
        await _cacheService.SetAsync(ModifyKey(user.Email), user);
    }

    public async Task Update(User user)
    {
        await _userRepo.UpdateUser(user);
        await _cacheService.SetAsync(ModifyKey(user.Email), user);
    }
}
