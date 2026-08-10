using System.ComponentModel.DataAnnotations;
using backend.DataAnnotations;

namespace backend.Dtos.Transaction;

public class CreateIncomeTransactionDto
{
    [Required]
    public int ToAccountId { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
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
