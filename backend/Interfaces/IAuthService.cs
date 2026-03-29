using backend.Models;

namespace backend.Interfaces;

public interface IAuthService
{
    void CreateUser(User user, string password);
}
