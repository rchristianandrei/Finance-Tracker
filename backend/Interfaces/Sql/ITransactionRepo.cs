using backend.Dtos;
using backend.Dtos.Reports;
using backend.Dtos.Transaction;
using backend.Models;

namespace backend.Interfaces.Sql;

public interface ITransactionRepo
{
    Task Create(Transaction entity);

    Task Update(Transaction entity);

    Task<int> GetCountByCategoryId(int categoryId);

    Task<Transaction?> GetById(long id);

    Task<(IEnumerable<Transaction> Transactions, long count)> GetAll(int userId, TransactionQueryParameters query);

    Task<DashboardDto> GetDashboard(int userId, DashboardQueryParams? query = null);

    Task Delete(Transaction transaction);
}
