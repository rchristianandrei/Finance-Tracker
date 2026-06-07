using backend.Models;

namespace backend.Interfaces.Sql;

public interface IRefreshTokenService
{
    Task<string> CreateAsync(int userId);
    Task<RefreshToken?> ValidateAsync(string raw);
    Task RevokeAsync(RefreshToken token);
    Task RevokeAllForUserAsync(int userId);
}
