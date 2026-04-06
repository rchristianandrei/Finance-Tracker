

using backend.Models;

namespace backend.Interfaces;

public interface ITransactionService
{
    Task Create(Transaction entity);

    Task<IEnumerable<Transaction>> GetAll(string email, string filterTerm = "", int limit = 20);

    Task<IEnumerable<Transaction>> GetLastDays(string email, int days);
}
