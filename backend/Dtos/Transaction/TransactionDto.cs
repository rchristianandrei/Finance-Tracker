using backend.Dtos.Account;
using backend.Dtos.Category;
using backend.Enums;

namespace backend.Dtos.Transaction;

public class TransactionDto
{
    public long Id { get; set; }
    public TransactionType Type { get; set; }
    public AccountDto? FromAccount { get; set; }
    public AccountDto? ToAccount { get; set; }
    public CategoryDto? Category { get; set; }
    public string? Description { get; set; }
    public double Amount { get; set; }
    public DateTimeOffset Date { get; set; }
}
