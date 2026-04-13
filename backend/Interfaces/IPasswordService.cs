using backend.Models;

namespace backend.Interfaces;

public interface IPasswordService
{
    void HashPassword(LocalCredential localCredentials, string password);

    bool VerifyPassword(LocalCredential localCredentials, string password);
}
