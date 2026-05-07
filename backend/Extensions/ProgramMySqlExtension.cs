using backend.Data;
using backend.Interfaces.Sql;
using backend.Repositories.Sql;
using Microsoft.EntityFrameworkCore;

namespace backend.Extensions;

public static class ProgramMySqlExtension
{
    public static IServiceCollection AddMySql(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IUserRepo, UserRepo>();
        services.AddScoped<IGoogleCredentialRepo, GoogleCredentialRepo>();
        services.AddScoped<ILocalCredentialRepo, LocalCredentialRepo>();
        services.AddScoped<IAccountRepo, AccountRepo>();
        services.AddScoped<IDefaultAccountRepo, DefaultAccountRepo>();
        services.AddScoped<ICategoryRepo, CategoryRepo>();
        services.AddScoped<ITransactionRepo, TransactionRepo>();

        return services;
    }
}
