using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Transaction;

public class CreateIncomeTransactionDto : CreateTransactionBaseDto
{
    [Required]
    public int ToAccountId { get; set; }

    [Required]
    public int CategoryId { get; set; }
}
