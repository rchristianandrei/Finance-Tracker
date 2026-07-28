using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Account;

public class CreateAccountDto
{
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    public double InitialBalance { get; set; }
}
