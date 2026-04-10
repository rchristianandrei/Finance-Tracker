using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Services;

public class AuthService(IPasswordHasher<LocalCredential> _passwordHasher) : IAuthService
{
    public void CreateUser(LocalCredential localCredentials, string password)
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
