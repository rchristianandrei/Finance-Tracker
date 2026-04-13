using backend.Data;
using backend.Interfaces.MySql;
using backend.Models;

namespace backend.Repositories.MySql;

public class UserRepo(ApplicationDbContext _context) : IUserRepo
{
    public async Task<User?> GetById(int id)
    {
        var user = await _context.Users.FindAsync(id);
        return user;
    }

    public async Task Create(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task Update(User user)
    {
        await _context.SaveChangesAsync();
    }
}
