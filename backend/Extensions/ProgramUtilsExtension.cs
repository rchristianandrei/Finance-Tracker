using backend.Interfaces.Utils;
using backend.Models;
using backend.Services.Utils;
using Microsoft.AspNetCore.Identity;

namespace backend.Extensions;

public static class ProgramUtilsExtension
{
    public static IServiceCollection AddUtils(this IServiceCollection services)
    {
        // Identity
        services.AddScoped<IPasswordHasher<LocalCredential>, PasswordHasher<LocalCredential>>();

        // Services
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<IOtpService, OtpService>();
        services.AddScoped<ITokenService, TokenService>();

        return services;
    }
}
