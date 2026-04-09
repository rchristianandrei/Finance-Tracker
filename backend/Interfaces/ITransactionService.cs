using backend.Dtos;
using backend.Models;
using MongoDB.Driver;

namespace backend.Interfaces;

public interface ITransactionService
{
    Task Create(Transaction entity);

    Task<ReplaceOneResult?> Update(Transaction entity);

    Task<Transaction?> GetById(string id);

    Task<(IEnumerable<Transaction> Transactions, long count)> GetAll(string email, TransactionQueryParameters query);

    Task<IEnumerable<Transaction>> GetLastDays(string email, int days);

    Task<DeleteResult?> Delete(string id);
}
