using backend.Dtos;
using backend.Models;

namespace backend.Interfaces.MySql;

public interface IUserRepo
{
    Task<User?> GetById(int id);

    Task Create(User user);

    Task Update(User user);

    Task<(ICollection<User> users, long count)> GetAll(QueryParameters query);
}
