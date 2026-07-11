using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class VerifyAccount
{
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string Token { get; set; } = string.Empty;

    public string Otp { get; set; } = string.Empty;

    public DateTimeOffset ExpiresAt { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTime.UtcNow;
}
