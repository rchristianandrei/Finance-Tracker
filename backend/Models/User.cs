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

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    [JsonIgnore]
    public LocalCredential? LocalCredential { get; set; }
    [JsonIgnore]
    public GoogleCredential? GoogleCredential { get; set; }
}
