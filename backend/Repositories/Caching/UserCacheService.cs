using backend.Data;
using backend.Interfaces;
using backend.Models;

namespace backend.Repositories.Caching;

public class UserCacheService(IUserRepo _userRepo, ApplicationDbContext _context, ICacheService _cacheService) : IUserCacheService
{
    private static string ModifyKey(int key) => $"user:{key}";

    public async Task<User?> GetById(int id)
    {
        var cached = await _cacheService.GetAsync<User>(ModifyKey(id));
        if (cached != null) return cached;

        var user = await _context.Users.FindAsync(id);
        if (user != null) await _cacheService.SetAsync(ModifyKey(id), user);

        return user;
    }

    public async Task Create(User user)
    {
        await _userRepo.CreateUser(user);
        await _cacheService.SetAsync(ModifyKey(user.Id), user);
    }

    public async Task Update(User user)
    {
        await _userRepo.UpdateUser(user);
        await _cacheService.SetAsync(ModifyKey(user.Id), user);
    }
}
