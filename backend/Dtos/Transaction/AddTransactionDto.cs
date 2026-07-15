using System.ComponentModel.DataAnnotations;
using backend.DataAnnotations;
using backend.Enums;

namespace backend.Dtos.Transaction;

public class AddTransactionDto
{
    [Required]
    public int CategoryId { get; set; }

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
