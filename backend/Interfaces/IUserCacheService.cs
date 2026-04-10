using backend.Models;

namespace backend.Interfaces;

public interface IUserCacheService
{
    Task<User?> GetById(int id);

    Task Create(User user);

    Task Update(User user);
}
