namespace backend.Extensions;

public static class ProgramCorsExtension
{
    public static string ConfigureCors(this IServiceCollection services, IConfiguration configuration)
    {
        var policyName = "AppCorsPolicy";

        var allowedOrigins = configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>();

        services.AddCors(options =>
        {
            options.AddPolicy(policyName, policy =>
            {
                policy
                    .WithOrigins(allowedOrigins!)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });
        return policyName;
    }
}
