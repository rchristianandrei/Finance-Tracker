using System.ComponentModel.DataAnnotations;
using backend.DataAnnotations;

namespace backend.Dtos;

public class AddTransactionDto
{
    [Required]
    public string Type { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [GreaterThanZero(ErrorMessage = "Amount must be greater than zero")]
    [Range(0, double.MaxValue)]
    public double Amount { get; set; }

    [MaxLength(30)]
    public string Description { get; set; } = string.Empty;
}
