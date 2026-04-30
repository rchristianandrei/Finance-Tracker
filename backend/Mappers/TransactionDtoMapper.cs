using backend.Dtos;
using backend.Models;

namespace backend.Mappers;

public static class TransactionDtoMapper
{
    public static TransactionDto ToDto(this Transaction t)
    {
        return new TransactionDto
        {
            Id = t.Id,
            Date = t.Date,
            Type = t.Type,
            Category = t.Category,
            Description = t.Description,
            Amount = t.Amount
        };
    }
}
