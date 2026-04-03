using backend.Models;
using MongoDB.Driver;

namespace backend.Infrastructure;

public class MongoDbInitializer(IMongoDatabase _database)
{
    public async Task InitializeAsync()
    {
        var collection = _database.GetCollection<Transaction>("transactions");

        // Compound index: AccountId + CreatedAt (most common query pattern)
        var indexKeys = Builders<Transaction>.IndexKeys
            .Ascending(x => x.AccountId)
            .Descending(x => x.CreatedAt);

        var indexModel = new CreateIndexModel<Transaction>(indexKeys);

        await collection.Indexes.CreateOneAsync(indexModel);

        // Optional: single field index (if you query CreatedAt alone)
        var createdAtIndex = Builders<Transaction>.IndexKeys
            .Descending(x => x.CreatedAt);

        await collection.Indexes.CreateOneAsync(
            new CreateIndexModel<Transaction>(createdAtIndex)
        );
    }
}
