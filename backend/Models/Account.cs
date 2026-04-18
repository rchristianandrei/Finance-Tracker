namespace backend.Models;

public class Account
{
    public int Id { get; set; }
    public int OwnerId { get; set; }
    public string Name { get; set; } = null!;
    public int Balance { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public User Owner { get; set; } = null!;
}
