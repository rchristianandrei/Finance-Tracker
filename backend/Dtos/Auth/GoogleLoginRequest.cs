using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Auth;

public class GoogleLoginRequest
{
    [Required]
    public string IdToken { get; set; } = string.Empty;
}
