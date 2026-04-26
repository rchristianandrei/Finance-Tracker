using backend.Enums;

namespace backend.Dtos;

public class TransactionDto
{
    public string Id { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public TransactionType Type { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Amount { get; set; }
}
