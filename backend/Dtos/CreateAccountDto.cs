using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public class CreateAccountDto
{
    [Required]
    [MaxLength(20)]
    public string Name { get; set; } = string.Empty;
}
