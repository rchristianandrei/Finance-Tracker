using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Extensions;

public static class ProgramRateLimitingExtension
{
    public static IServiceCollection AddRateLimiting(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.AddFixedWindowLimiter("fixed", opt =>
            {
                opt.Window = TimeSpan.FromSeconds(10);
                opt.PermitLimit = 10;
                opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                opt.QueueLimit = 2;
            });

            options.AddSlidingWindowLimiter("sliding", opt =>
            {
                opt.Window = TimeSpan.FromSeconds(30);
                opt.SegmentsPerWindow = 3;
                opt.PermitLimit = 15;
                opt.QueueLimit = 0;
            });

            options.AddTokenBucketLimiter("token", opt =>
            {
                opt.TokenLimit = 20;
                opt.ReplenishmentPeriod = TimeSpan.FromSeconds(10);
                opt.TokensPerPeriod = 5;
                opt.AutoReplenishment = true;
            });

            options.AddConcurrencyLimiter("concurrency", opt =>
            {
                opt.PermitLimit = 5;
                opt.QueueLimit = 10;
            });

            options.AddPolicy("per-user", httpContext =>
                RateLimitPartition.GetSlidingWindowLimiter(
                    partitionKey: httpContext.User?.Identity?.Name
                                ?? httpContext.Connection.RemoteIpAddress?.ToString()
                                ?? "anonymous",
                    factory: _ => new SlidingWindowRateLimiterOptions
                    {
                        PermitLimit = 30,
                        Window = TimeSpan.FromMinutes(1),
                        SegmentsPerWindow = 6
                    }));

            options.OnRejected = async (context, cancellationToken) =>
            {
                context.HttpContext.Response.StatusCode = 429;

                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                {
                    context.HttpContext.Response.Headers.RetryAfter =
                        ((int)retryAfter.TotalSeconds).ToString();
                }

                await context.HttpContext.Response.WriteAsJsonAsync(new
                {
                    error = "Too many requests. Please slow down.",
                    retryAfter = retryAfter.TotalSeconds
                }, cancellationToken);
            };
        });
        return services;
    }
}
