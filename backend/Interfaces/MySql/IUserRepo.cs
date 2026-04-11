using backend.Models;

namespace backend.Interfaces.MySql;

public interface IUserRepo
{
    Task<User?> GetUserByEmail(int id);

    Task CreateUser(User user);

    Task UpdateUser(User user);
}
