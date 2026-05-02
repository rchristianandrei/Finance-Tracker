using backend.Dtos;
using backend.Models;

namespace backend.Interfaces.MySql;

public interface ITransactionService
{
    Task Create(Transaction entity);

    Task Update(Transaction entity);

    Task<Transaction?> GetById(long id);

    Task<(IEnumerable<Transaction> Transactions, long count)> GetAll(int accountId, QueryParameters query);

    Task<IEnumerable<Transaction>> GetLastDays(int accountId, int days);

    Task Delete(Transaction transaction);
}
