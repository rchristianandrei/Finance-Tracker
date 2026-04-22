using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public class CreateAccountDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
}
