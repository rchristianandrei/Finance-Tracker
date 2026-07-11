using backend.Enums;
using backend.Models;

namespace backend.Interfaces.Sql;

public interface ICategoryRepo
{
    Task<Category?> IfExists(int userId, TransactionType type, string categoryName);
    Task Create(Category category);
    Task<Category?> GetById(int id);
    Task<ICollection<Category>> GetAll(int userId);
    Task Update(Category category);
    Task Delete(Category category);
}
