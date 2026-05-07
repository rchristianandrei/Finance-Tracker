using backend.Interfaces.Utils;
using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Services.Utils;

public class PasswordService(IPasswordHasher<LocalCredential> _passwordHasher) : IPasswordService
{
    public void HashPassword(LocalCredential localCredentials, string password)
    {
        localCredentials.PasswordHash = _passwordHasher.HashPassword(localCredentials, password);
    }

    public bool VerifyPassword(LocalCredential localCredentials, string password)
    {
        var result = _passwordHasher.VerifyHashedPassword(
            localCredentials,
            localCredentials.PasswordHash,
            password);

        return result == PasswordVerificationResult.Success;
    }
}
