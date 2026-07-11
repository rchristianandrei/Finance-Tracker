using backend.Data;
using backend.Interfaces.Sql;
using backend.Services.Sql;
using Microsoft.EntityFrameworkCore;

namespace backend.Extensions;

public static class ProgramSqlExtension
{
    public static IServiceCollection AddMySql(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"), npgsqlOptions =>
        {
            npgsqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorCodesToAdd: null
            );
        }));

        services.AddScoped<IUserRepo, UserRepo>();
        services.AddScoped<IRefreshTokenService, RefreshTokenService>();
        services.AddScoped<IGoogleCredentialRepo, GoogleCredentialRepo>();
        services.AddScoped<IAccountRepo, AccountRepo>();
        services.AddScoped<IDefaultAccountRepo, DefaultAccountRepo>();
        services.AddScoped<ICategoryRepo, CategoryRepo>();
        services.AddScoped<ITransactionRepo, TransactionRepo>();

        return services;
    }
}
