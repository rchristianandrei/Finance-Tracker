using System.Text.Json.Serialization;

namespace backend.Models;

public class Account
{
    public int Id { get; set; }

    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    public string Name { get; set; } = null!;

    public double Balance { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTimeOffset UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public ICollection<Category> Categories { get; set; } = [];
    [JsonIgnore]
    public ICollection<Transaction> Transactions { get; set; } = [];
}
