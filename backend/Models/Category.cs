using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using backend.Enums;

namespace backend.Models;

public class Category
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public TransactionType Type { get; set; } = TransactionType.EXPENSE;

    [MaxLength(50)]
    public required string Name { get; set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTimeOffset UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public ICollection<Transaction> Transactions { get; set; } = [];
}
