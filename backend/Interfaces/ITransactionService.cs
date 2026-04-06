

using backend.Models;

namespace backend.Interfaces;

public interface ITransactionService
{
    Task Create(Transaction entity);

    Task<IEnumerable<Transaction>> GetLastDays(string email, int days);
}
