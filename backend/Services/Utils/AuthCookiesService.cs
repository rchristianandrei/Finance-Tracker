using backend.Interfaces.Utils;
using backend.Settings;
using Microsoft.Extensions.Options;

namespace backend.Services.Utils;

public class AuthCookiesService(
    IHttpContextAccessor _httpContextAccessor,
    IOptions<JwtSettings> _jwtSettingsAccessor
) : IAuthCookiesService
{
    private readonly JwtSettings _jwtSettings = _jwtSettingsAccessor.Value;

    public readonly static string AuthKey = "Authorization";
    public readonly static string RefreshKey = "refreshToken";

    public void AttachAuthCookies(string token)
    {
        _httpContextAccessor?.HttpContext?.Response.Cookies.Append(AuthKey, token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(Convert.ToInt32(_jwtSettings.ExpireMinutes))
        });
    }

    public void AttachRefreshCookie(string rawToken)
    {
        _httpContextAccessor.HttpContext!.Response.Cookies.Append(RefreshKey, rawToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddDays(30)
        });
    }

    public string? GetRefreshToken() =>
        _httpContextAccessor.HttpContext?.Request.Cookies[RefreshKey];

    public void ClearAuthCookies()
    {
        _httpContextAccessor.HttpContext!.Response.Cookies.Delete(AuthKey);
        _httpContextAccessor.HttpContext!.Response.Cookies.Delete(RefreshKey);
    }
}
