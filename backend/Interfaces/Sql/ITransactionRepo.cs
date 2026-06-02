using backend.Dtos.Transaction;
using backend.Models;

namespace backend.Interfaces.Sql;

public interface ITransactionRepo
{
    Task Create(Transaction entity);

    Task Update(Transaction entity);

    Task<int> GetCountByAccountId(int accountId);

    Task<Transaction?> GetById(long id);

    Task<(IEnumerable<Transaction> Transactions, long count)> GetAll(int accountId, TransactionQueryParameters query);

    Task<IEnumerable<Transaction>> GetLastDays(int accountId, int days);

    Task Delete(Transaction transaction);
}
