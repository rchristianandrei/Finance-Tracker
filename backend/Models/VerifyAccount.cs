using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class VerifyAccount
{
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string Token { get; set; } = string.Empty;

    public string Otp { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public LocalCredential LocalCredential { get; set; } = null!;
}
