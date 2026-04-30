using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models;

public class User
{
    public int Id { get; set; }

    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [MaxLength(25)]
    public string LastName { get; set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public GoogleCredential? GoogleCredential { get; set; }
    [JsonIgnore]
    public ICollection<Account> Accounts { get; set; } = [];
    [JsonIgnore]
    public DefaultAccount? DefaultAccount { get; set; }
    [JsonIgnore]
    public ICollection<Transaction> Transactions { get; set; } = [];
}
