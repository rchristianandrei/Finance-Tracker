using backend.Models;

namespace backend.Interfaces.Caching;

public interface IUserCache
{
    Task<User?> GetById(int id);

    Task Create(User user);

    Task Update(User user);
}
