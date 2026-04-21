using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public class UpdateAccountDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public bool IsDefault { get; set; }
}
