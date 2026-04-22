using backend.Models;

namespace backend.Interfaces.MySql;

public interface IAccountRepo
{
    Task Create(Account account);
    Task<List<Account>> GetAccounts(int userId);
    Task<List<Account>> GetAccountsAsNoTracking(int userId);
    Task<Account?> GetById(int id);
    Task Update(Account account);
    Task Delete(Account account);
}
