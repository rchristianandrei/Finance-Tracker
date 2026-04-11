using backend.Models;

namespace backend.Interfaces.MySql;

public interface IVerifyAccountRepo
{
    Task<VerifyAccount> Create(string email);
    Task<VerifyAccount?> GetByEmail(string email);
    Task Update(VerifyAccount verify);
}
