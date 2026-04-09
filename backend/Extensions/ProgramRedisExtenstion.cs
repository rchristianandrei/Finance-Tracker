using backend.Interfaces;
using backend.Repositories.Caching;

namespace backend.Extensions;

public static class ProgramRedisExtenstion
{
    public static IServiceCollection AddRedis(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration["Redis:ConnectionString"];
            options.InstanceName = "FinanceTracker:"; // optional key prefix
        });
        services.AddSingleton<ICacheService, RedisCacheService>();
        services.AddScoped<IUserCacheService, UserCacheService>();
        return services;
    }
}
