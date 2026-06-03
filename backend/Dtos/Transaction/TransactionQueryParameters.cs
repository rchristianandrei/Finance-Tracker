using backend.Enums;

namespace backend.Dtos.Transaction;

public class TransactionQueryParameters : QueryParameters
{
    public TransactionType? TransactionType { get; set; }

    public string[]? Categories { get; set; } = [];
}
