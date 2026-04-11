using backend.Data;
using backend.Interfaces.MySql;
using backend.Repositories.MySql;
using Microsoft.EntityFrameworkCore;

namespace backend.Extensions;

public static class ProgramMySqlExtension
{
    public static IServiceCollection AddMySql(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<ApplicationDbContext>(options => options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

        services.AddScoped<IUserRepo, UserRepo>();
        services.AddScoped<IGoogleCredentialRepo, GoogleCredentialRepo>();
        services.AddScoped<ILocalCredentialRepo, LocalCredentialRepo>();

        return services;
    }
}
