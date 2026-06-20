using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Account;

public class CreateAccountDto
{
    [Required]
    [MaxLength(20)]
    public string Name { get; set; } = string.Empty;

    public bool IsDefault { get; set; }
}
