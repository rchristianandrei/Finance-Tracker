using backend.Models;

namespace backend.Interfaces.MySql;

public interface IDefaultAccountRepo
{
    Task Create(DefaultAccount defaultAccount);
    Task<DefaultAccount?> GetById(int id);
    Task Update(DefaultAccount defaultAccount);
}
