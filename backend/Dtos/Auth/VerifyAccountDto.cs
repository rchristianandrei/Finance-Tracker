namespace backend.Dtos.Auth;

public class VerifyAccountDto
{
    public string Token { get; set; } = string.Empty;

    public string Otp { get; set; } = string.Empty;
}
