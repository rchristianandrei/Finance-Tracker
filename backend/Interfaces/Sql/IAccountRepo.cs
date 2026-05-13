using backend.Models;

namespace backend.Interfaces.Sql;

public interface IAccountRepo
{
    Task Create(Account account);
    Task<List<Account>> GetAccounts(int userId);
    Task<Account?> GetById(int id);
    Task Update(Account account);
    Task Delete(Account account);
}
