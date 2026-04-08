

using backend.Dtos;
using backend.Models;

namespace backend.Interfaces;

public interface ITransactionService
{
    Task Create(Transaction entity);

    Task<(IEnumerable<Transaction> Transactions, long count)> GetAll(string email, TransactionQueryParameters query);

    Task<IEnumerable<Transaction>> GetLastDays(string email, int days);
}
