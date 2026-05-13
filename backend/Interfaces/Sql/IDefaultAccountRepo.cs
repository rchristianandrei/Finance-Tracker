using backend.Models;

namespace backend.Interfaces.Sql;

public interface IDefaultAccountRepo
{
    Task Create(DefaultAccount defaultAccount);
    Task<DefaultAccount?> GetById(int id);
    Task Update(DefaultAccount defaultAccount);
}
