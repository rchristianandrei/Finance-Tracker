using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class GoogleCredential
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string Subject { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
