using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class LocalCredential
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [EmailAddress]
    [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Email must contain a domain like .com")]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public bool IsVerified { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public VerifyAccount? VerifyAccount { get; set; }
}
