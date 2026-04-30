using System.ComponentModel.DataAnnotations;
using backend.Enums;

namespace backend.Models;

public class Category
{
    public int Id { get; set; }

    public int AccountId { get; set; }
    public Account Account { get; set; } = null!;

    public TransactionType Type { get; set; } = TransactionType.EXPENSE;

    [MaxLength(20)]
    public required string Name { get; set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTimeOffset UpdatedAt { get; set; } = DateTime.UtcNow;
}
