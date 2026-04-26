using System.ComponentModel.DataAnnotations;
using backend.Enums;

namespace backend.Dtos.Category;

public class UpdateCategoryDto
{
    public int Id { get; set; }

    public TransactionType Type { get; set; } = TransactionType.EXPENSE;

    [Required]
    public string Name { get; set; } = string.Empty;
}
