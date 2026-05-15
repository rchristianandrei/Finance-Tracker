using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using backend.Enums;

namespace backend.Models;

public class Transaction
{
    public long Id { get; set; }

    [Required]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Required]
    public int AccountId { get; set; }
    public Account Account { get; set; } = null!;

    [Required]
    public TransactionType Type { get; set; }

    public int CategoryId { get; set; } = 0;
    [JsonIgnore]
    public Category Category { get; set; } = null!;

    [Required]
    [Range(0, double.MaxValue)]
    public double Amount { get; set; }

    [MaxLength(30)]
    public string Description { get; set; } = string.Empty;

    public DateTimeOffset Date { get; set; } = DateTime.UtcNow;

    public DateTimeOffset CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTimeOffset LastUpdated { get; set; } = DateTime.UtcNow;
}
