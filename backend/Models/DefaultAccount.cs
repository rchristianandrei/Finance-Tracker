namespace backend.Models;

public class DefaultAccount
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int AccountId { get; set; }
    public Account Account { get; set; } = null!;

    public DateTimeOffset CreatedAt { get; set; } = DateTime.UtcNow;
}
