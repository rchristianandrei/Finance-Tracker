using backend.Interfaces;
using backend.Settings;
using Microsoft.Extensions.Options;

namespace backend.Services;

public class AuthCookiesService(
    IHttpContextAccessor _httpContextAccessor,
    IOptions<JwtSettings> _jwtSettingsAccessor
) : IAuthCookiesService
{
    private readonly JwtSettings _jwtSettings = _jwtSettingsAccessor.Value;

    public readonly static string AuthKey = "Authorization";

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

    public void RemoveAuthCookies()
    {
        _httpContextAccessor?.HttpContext?.Response.Cookies.Append(AuthKey, "", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(-1)
        });
    }
}
