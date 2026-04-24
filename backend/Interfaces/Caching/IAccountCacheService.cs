using backend.Models;

namespace backend.Interfaces.Caching;

public interface IAccountCacheService
{
    Task<Account?> GetById(int id);
    Task<ICollection<Account>> GetAccounts(int userId);

    Task Create(Account account);

    Task Update(Account account);

    Task Delete(Account account);
}
