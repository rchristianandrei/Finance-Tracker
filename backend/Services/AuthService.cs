using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Services;

public class AuthService(IPasswordHasher<User> _passwordHasher) : IAuthService
{
    public void CreateUser(User user, string password)
    {
        user.PasswordHash = _passwordHasher.HashPassword(user, password);
    }
}
