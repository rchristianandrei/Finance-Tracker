using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class User
{
    [Key]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public bool IsVerified { get; set; } = false;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
