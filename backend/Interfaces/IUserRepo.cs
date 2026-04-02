using backend.Models;

namespace backend.Interfaces;

public interface IUserRepo
{
    Task<User?> GetUserByEmail(string email);

    Task CreateUser(User user);

    Task UpdateUser(User user);
}
