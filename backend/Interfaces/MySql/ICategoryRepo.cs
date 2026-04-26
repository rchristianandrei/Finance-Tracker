using backend.Enums;
using backend.Models;

namespace backend.Interfaces.MySql;

public interface ICategoryRepo
{
    Task Create(Category category);
    Task<Category?> GetById(int id, bool includeAccount = false);
    Task<ICollection<Category>> GetByAccountId(int accountId);
    Task<int> GetCountByAccountIdAndType(int accountId, TransactionType type);
    Task Update(Category category);
    Task Delete(Category category);
}
