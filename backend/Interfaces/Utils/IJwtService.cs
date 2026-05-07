using backend.Models;

namespace backend.Interfaces.Utils;

public interface IJwtService
{
    string GenerateToken(User user);
}
