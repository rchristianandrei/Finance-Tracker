using backend.Models;

namespace backend.Interfaces;

public interface IUserCacheService
{
    Task<User?> GetById(string email);

    Task Create(User user);

    Task Update(User user);
}
