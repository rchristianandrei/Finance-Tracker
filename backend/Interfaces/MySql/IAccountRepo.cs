using backend.Models;

namespace backend.Interfaces.MySql;

public interface IAccountRepo
{
    Task Create(Account account);
}
