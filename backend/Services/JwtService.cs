using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Enums;
using backend.Interfaces;
using backend.Models;
using backend.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services;

public class JwtService(IOptions<JwtSettings> jwtSettingsAccessor) : IJwtService
{
    private readonly JwtSettings _jwtSettings = jwtSettingsAccessor.Value;

    public string GenerateToken(User user)
    {
        var key = _jwtSettings.Key;
        var issuer = _jwtSettings.Issuer;
        var audience = _jwtSettings.Audience;
        var expiration = _jwtSettings.ExpireMinutes ?? "60";

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key ?? throw new InvalidOperationException("Missing JWT Key")));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new (JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        };

        if (user.IsAdmin)
            claims.Add(new(ClaimTypes.Role, Roles.ADMIN.ToString()));

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.Now.AddMinutes(Double.Parse(expiration)),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
