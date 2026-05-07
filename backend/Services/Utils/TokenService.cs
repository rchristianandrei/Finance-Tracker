using System.Security.Cryptography;
using backend.Interfaces.Utils;

namespace backend.Services.Utils;

public class TokenService : ITokenService
{
    public string GenerateToken(int size = 32)
    {
        byte[] bytes = new byte[size];

        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(bytes);
        }

        return Convert.ToBase64String(bytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");
    }
}
