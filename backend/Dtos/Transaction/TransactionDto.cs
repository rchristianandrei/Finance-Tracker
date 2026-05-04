using backend.Enums;

namespace backend.Dtos.Transaction;

public class TransactionDto
{
    public long Id { get; set; }
    public DateTimeOffset Date { get; set; }
    public TransactionType Type { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Amount { get; set; }
}
