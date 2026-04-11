using backend.Models;

namespace backend.Interfaces.MySql;

public interface IGoogleCredentialRepo
{
    Task<GoogleCredential?> GetBySub(string sub);

    Task Create(GoogleCredential googleCreds);
}
