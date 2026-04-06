using System.Security.Claims;
using backend.Interfaces;

namespace backend.Services;

public class CurrentUserService(IHttpContextAccessor _httpContextAccessor) : ICurrentUserService
{
    public string Email =>
        _httpContextAccessor?.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value
        ?? throw new UnauthorizedAccessException("No email claim found");
}
