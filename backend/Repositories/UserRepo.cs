using backend.Data;
using backend.Interfaces;
using backend.Models;

namespace backend.Repositories;

public class UserRepo(ApplicationDbContext _context, ICacheService _cache) : IUserRepo
{
    private readonly TimeSpan _expiry = TimeSpan.FromMinutes(5);
    private static string ModifyKey(string email) => $"user:{email}";
    private async Task CacheUser(User user) => await _cache.SetAsync(ModifyKey(user.Email), user, _expiry);

    public async Task<User?> GetUserByEmail(string email)
    {
        var cached = await _cache.GetAsync<User>(ModifyKey(email));
        if (cached != null) return cached;

        var user = await _context.Users.FindAsync(email);

        if (user != null)
            await CacheUser(user);

        return user;
    }

    public async Task CreateUser(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        await CacheUser(user);
    }

    public async Task UpdateUser(User user)
    {
        await _context.SaveChangesAsync();
        await CacheUser(user);
    }
}
