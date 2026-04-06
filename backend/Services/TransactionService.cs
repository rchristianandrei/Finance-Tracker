using System.Text.RegularExpressions;
using backend.Interfaces;
using backend.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace backend.Services;

public class TransactionService(IMongoDatabase database) : ITransactionService
{
    private readonly IMongoCollection<Transaction> _entities = database.GetCollection<Transaction>("Transactions");

    public async Task Create(Transaction entity)
    {
        await _entities.InsertOneAsync(entity);
    }

    public async Task<IEnumerable<Transaction>> GetAll(string email, string filterTerm = "", int limit = 20)
    {
        var builder = Builders<Transaction>.Filter;

        var filter = builder.Eq(t => t.Email, email);

        if (!string.IsNullOrWhiteSpace(filterTerm))
        {
            var regex = new BsonRegularExpression(Regex.Escape(filterTerm), "i");

            var keywordFilter = builder.Or(
                builder.Regex(t => t.Type, regex),
                builder.Regex(t => t.Category, regex),
                builder.Regex(t => t.Description, regex)
            );

            filter &= keywordFilter;
        }

        var transactions = await _entities
            .Find(filter)
            .SortByDescending(t => t.CreatedAt)
            .Limit(limit)
            .ToListAsync();

        return transactions;
    }

    public async Task<IEnumerable<Transaction>> GetLastDays(string email, int days)
    {
        var now = DateTime.UtcNow;
        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-days);
        var filter = Builders<Transaction>.Filter.And(
            Builders<Transaction>.Filter.Eq(t => t.Email, email),
            Builders<Transaction>.Filter.Gte(t => t.CreatedAt, thirtyDaysAgo),
            Builders<Transaction>.Filter.Lte(t => t.CreatedAt, now)
        );

        return await _entities
            .Find(filter)
            .SortByDescending(t => t.CreatedAt)
            .ToListAsync();
    }
}
