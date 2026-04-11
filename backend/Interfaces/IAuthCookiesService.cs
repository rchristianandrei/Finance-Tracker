namespace backend.Interfaces;

public interface IAuthCookiesService
{
    void AttachAuthCookies(string token);
    void RemoveAuthCookies();
}
