using backend.Enums;

namespace backend.Dtos.Category;

public class CategoryDto
{
    public int Id { get; set; }

    public TransactionType Type { get; set; }

    public required string Name { get; set; } = string.Empty;
}
