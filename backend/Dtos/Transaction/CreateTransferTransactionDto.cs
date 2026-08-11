using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Transaction;

public class CreateTransferTransactionDto : CreateTransactionBaseDto
{
    [Required]
    public int FromAccountId { get; set; }
    [Required]
    public int ToAccountId { get; set; }

    [Required]
    [Range(double.MinValue, double.MaxValue)]
    public override double Amount { get; set; }
}
