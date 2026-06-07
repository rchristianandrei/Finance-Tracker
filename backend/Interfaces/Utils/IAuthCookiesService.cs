namespace backend.Interfaces.Utils;

public interface IAuthCookiesService
{
    void AttachAuthCookies(string token);
    void AttachRefreshCookie(string rawToken);
    string? GetRefreshToken();
    void ClearAuthCookies();
}
