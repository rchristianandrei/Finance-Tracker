using backend.Data;
using backend.Enums;
using backend.Interfaces.Sql;
using backend.Services.Sql;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace backend.Extensions;

public static class ProgramSqlExtension
{
    public static IServiceCollection AddMySql(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
        var dataSource = dataSourceBuilder.Build();

        services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(dataSource, npgsqlOptions =>
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
        services.AddScoped<ICategoryRepo, CategoryRepo>();
        services.AddScoped<ITransactionRepo, TransactionRepo>();
        services.AddScoped<AccountRepo>();

        return services;
    }
}
