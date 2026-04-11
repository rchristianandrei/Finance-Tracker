using backend.Models;

namespace backend.Interfaces.MySql;

public interface ILocalCredentialRepo
{
    Task Create(LocalCredential local);
    Task<LocalCredential?> GetByEmail(string email);
}
