namespace backend.Interfaces.Utils;

public interface ITokenService
{
    string GenerateToken(int size = 32);
}
