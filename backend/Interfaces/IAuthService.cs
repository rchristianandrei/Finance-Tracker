using backend.Models;

namespace backend.Interfaces;

public interface IAuthService
{
    void CreateUser(LocalCredential localCredentials, string password);

    bool VerifyPassword(LocalCredential localCredentials, string password);
}
