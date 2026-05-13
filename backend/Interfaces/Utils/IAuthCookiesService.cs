namespace backend.Interfaces.Utils;

public interface IAuthCookiesService
{
    void AttachAuthCookies(string token);
    void RemoveAuthCookies();
}
