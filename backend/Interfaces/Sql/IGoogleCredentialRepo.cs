using backend.Models;

namespace backend.Interfaces.Sql;

public interface IGoogleCredentialRepo
{
    Task<GoogleCredential?> GetBySub(string sub);

    Task Create(GoogleCredential googleCreds);
}
