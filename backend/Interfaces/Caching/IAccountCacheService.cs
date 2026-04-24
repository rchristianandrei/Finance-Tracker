using backend.Models;

namespace backend.Interfaces.Caching;

public interface IAccountCacheService
{
    Task<Account?> GetById(int id);
    Task<ICollection<Account>> GetAccounts(int userId);

    Task Create(int userId, Account account);

    Task Update(int userId, Account account);

    Task Delete(int userId, Account account);
}
