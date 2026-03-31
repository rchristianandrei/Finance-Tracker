using backend.Models;

namespace backend.Interfaces;

public interface IVerifyAccountService
{
    /// <summary>
    /// Generate a token stored in cache by user email
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    Task<string> GenerateToken(User user);

    /// <summary>
    /// Finds a user email stored in cache by token
    /// </summary>
    /// <param name="token"></param>
    /// <returns></returns>
    Task<string?> GetUserEmailByToken(string token);
}