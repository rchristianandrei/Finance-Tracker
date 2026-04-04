using System.ComponentModel.DataAnnotations;
using backend.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class Transaction
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [Required]
    public TransactionType Type { get; set; }

    [Required]
    [MaxLength(30)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue)]
    public double Amount { get; set; }

    [MaxLength(30)]
    public string Description { get; set; } = string.Empty;

    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}
