using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public class GoogleLoginRequest
{
    [Required]
    public string IdToken { get; set; } = string.Empty;
}
