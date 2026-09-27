using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Transaction;

public class CreateExpenseTransactionDto : CreateTransactionBaseDto
{
    [Required]
    public int FromAccountId { get; set; }

    [Required]
    public int CategoryId { get; set; }

    public DateTime? _dashboardDate { get; set; }

    public DateTime? DashboardDate
    {
        get => _dashboardDate;
        set => _dashboardDate = value?.Kind == DateTimeKind.Utc
            ? value
            : value?.ToUniversalTime();
    }
}
