using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Account;

public class UpdateAccountDto
{
    [Required]
    [MaxLength(20)]
    public string Name { get; set; } = string.Empty;
}
