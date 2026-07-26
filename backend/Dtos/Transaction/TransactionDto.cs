using backend.Dtos.Account;
using backend.Dtos.Category;
using backend.Enums;

namespace backend.Dtos.Transaction;

public class TransactionDto
{
    public long Id { get; set; }
    public DateTimeOffset Date { get; set; }
    public TransactionType Type { get; set; }
    public AccountDto Account { get; set; } = null!;
    public CategoryDto Category { get; set; } = null!;
    public string Description { get; set; } = string.Empty;
    public double Amount { get; set; }
}
