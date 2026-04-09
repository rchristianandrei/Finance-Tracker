using backend.Data;
using backend.Interfaces;
using backend.Models;

namespace backend.Repositories;

public class UserRepo(ApplicationDbContext _context) : IUserRepo
{
    public async Task<User?> GetUserByEmail(string email)
    {
        var user = await _context.Users.FindAsync(email);
        return user;
    }

    public async Task CreateUser(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateUser(User user)
    {
        await _context.SaveChangesAsync();
    }
}
