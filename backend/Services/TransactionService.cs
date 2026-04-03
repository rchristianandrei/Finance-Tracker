using backend.Models;
using MongoDB.Driver;

namespace backend.Services;

public class TransactionService(IMongoDatabase database)
{
    private readonly IMongoCollection<Transaction> entities = database.GetCollection<Transaction>("Transactions");

    public async Task Create(Transaction entity)
    {
        await entities.InsertOneAsync(entity);
    }

    public async Task<IEnumerable<Transaction>> GetAll()
    {
        return await (await entities.FindAsync(_ => true)).ToListAsync();
    }
}
