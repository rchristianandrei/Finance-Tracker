using backend.Interfaces.Utils;
using System.Security.Claims;

namespace backend.Services.Utils;

public class CurrentUserService(IHttpContextAccessor _httpContextAccessor) : ICurrentUserService
{
    public int Id()
    {
        var rawId = _httpContextAccessor?.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(rawId, out int id))
            throw new UnauthorizedAccessException("No Sub claim found");

        return id;
    }

}
