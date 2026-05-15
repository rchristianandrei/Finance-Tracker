using System.ComponentModel.DataAnnotations;
using backend.DataAnnotations;
using backend.Enums;

namespace backend.Dtos.Transaction;

public class AddTransactionDto
{
    public int AccountId { get; set; }

    [Required]
    public TransactionType Type { get; set; }

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [GreaterThanZero(ErrorMessage = "Amount must be greater than zero")]
    [Range(0, double.MaxValue)]
    public double Amount { get; set; }

    [MaxLength(30)]
    public string Description { get; set; } = string.Empty;

    public DateTime _date { get; set; }

    public DateTime Date
    {
        get => _date;
        set => _date = value.Kind == DateTimeKind.Utc
            ? value
            : value.ToUniversalTime();
    }
}
