using backend.Models;
using MongoDB.Driver;

namespace backend.Services;

public class TransactionService(IMongoDatabase database)
{
    private readonly IMongoCollection<Transaction> _entities = database.GetCollection<Transaction>("Transactions");

    public async Task Create(Transaction entity)
    {
        await _entities.InsertOneAsync(entity);
    }

    public async Task<IEnumerable<Transaction>> GetAll()
    {
        var now = DateTime.UtcNow;
        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
        var filter = Builders<Transaction>.Filter.And(
            Builders<Transaction>.Filter.Gte(t => t.CreatedAt, thirtyDaysAgo),
            Builders<Transaction>.Filter.Lte(t => t.CreatedAt, now)
        );

        return await _entities
            .Find(filter)
            .SortByDescending(t => t.CreatedAt)
            .ToListAsync();
    }
}
