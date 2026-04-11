namespace backend.Interfaces.MySql;

public interface IVerifyAccountRepo
{
    Task<(string token, string otp)> Create(string email);
}
