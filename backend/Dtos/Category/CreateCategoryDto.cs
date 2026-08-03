using System.ComponentModel.DataAnnotations;
using backend.Enums;

namespace backend.Dtos.Category;

public class CreateCategoryDto
{
    [EnumDataType(typeof(TransactionType))]
    public TransactionType Type { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
}
