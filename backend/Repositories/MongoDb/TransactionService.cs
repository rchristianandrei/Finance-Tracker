using System.Text.RegularExpressions;
using backend.Dtos;
using backend.Interfaces;
using backend.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace backend.Repositories.MongoDb;

public class TransactionService(IMongoDatabase database) : ITransactionService
{
    private readonly IMongoCollection<Transaction> _entities = database.GetCollection<Transaction>("Transactions");

    public async Task Create(Transaction entity)
    {
        await _entities.InsertOneAsync(entity);
    }

    public async Task<ReplaceOneResult?> Update(Transaction entity)
    {
        return await _entities.ReplaceOneAsync(t => t.Id == entity.Id, entity);
    }

    public async Task<Transaction?> GetById(string id)
    {
        return await _entities.Find(t => t.Id == id).FirstOrDefaultAsync();
    }

    public async Task<(IEnumerable<Transaction> Transactions, long count)> GetAll(int userId, TransactionQueryParameters query)
    {
        var builder = Builders<Transaction>.Filter;

        var filter = builder.Eq(t => t.UserId, userId);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var regex = new BsonRegularExpression(Regex.Escape(query.Search), "i");

            var keywordFilter = builder.Or(
                builder.Regex(t => t.Type, regex),
                builder.Regex(t => t.Category, regex),
                builder.Regex(t => t.Description, regex)
            );

            filter &= keywordFilter;
        }

        if (query.StartDate.HasValue)
            filter &= builder.Gte(t => t.CreatedAt, query.StartDate.Value.Date);

        if (query.EndDate.HasValue)
            filter &= builder.Lte(t => t.CreatedAt, query.EndDate.Value.Date.AddDays(1).AddTicks(-1));

        var count = await _entities.Find(filter).CountDocumentsAsync();
        var transactions = await _entities
            .Find(filter)
            .SortByDescending(t => t.CreatedAt)
            .Skip((query.PageOrDefault - 1) * query.PageSizeOrDefault)
            .Limit(query.PageSizeOrDefault)
            .ToListAsync();

        return (transactions, count);
    }

    public async Task<IEnumerable<Transaction>> GetLastDays(int userId, int days)
    {
        var now = DateTime.UtcNow;
        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-days);
        var filter = Builders<Transaction>.Filter.And(
            Builders<Transaction>.Filter.Eq(t => t.UserId, userId),
            Builders<Transaction>.Filter.Gte(t => t.CreatedAt, thirtyDaysAgo),
            Builders<Transaction>.Filter.Lte(t => t.CreatedAt, now)
        );

        return await _entities
            .Find(filter)
            .SortByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<DeleteResult?> Delete(string id)
    {
        return await _entities.DeleteOneAsync(t => t.Id == id);
    }
}
