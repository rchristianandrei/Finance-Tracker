using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Transaction;

public class CreateExpenseTransactionDto : CreateTransactionBaseDto
{
    [Required]
    public int FromAccountId { get; set; }

    [Required]
    public int CategoryId { get; set; }
}
