using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using backend.Enums;

namespace backend.Models;

public class User
{
    public int Id { get; set; }

    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [MaxLength(25)]
    public string LastName { get; set; } = string.Empty;

    public bool IsAdmin { get; set; } = false;

    public UserStatus Status { get; set; } = UserStatus.PENDING;

    public DateTimeOffset CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTimeOffset UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public GoogleCredential? GoogleCredential { get; set; }
    [JsonIgnore]
    public ICollection<Account> Accounts { get; set; } = [];
    [JsonIgnore]
    public ICollection<Transaction> Transactions { get; set; } = [];
}
