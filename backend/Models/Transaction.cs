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

    public int? FromAccountId { get; set; }
    public Account? FromAccount { get; set; }

    public int? ToAccountId { get; set; }
    public Account? ToAccount { get; set; }

    public int? CategoryId { get; set; } = 0;
    public Category? Category { get; set; }

    [MaxLength(30)]
    public string? Description { get; set; }


    [Required]
    [Range(0, double.MaxValue)]
    public double Amount { get; set; }

    public DateTimeOffset Date { get; set; } = DateTime.UtcNow;

    public DateTimeOffset CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTimeOffset LastUpdated { get; set; } = DateTime.UtcNow;
}
