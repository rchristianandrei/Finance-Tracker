using backend.Models;

namespace backend.Interfaces.Sql;

public interface ILocalCredentialRepo
{
    Task Create(LocalCredential local);
    Task<LocalCredential?> GetByEmail(string email);
    Task Update();
}
