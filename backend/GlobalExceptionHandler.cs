using Microsoft.AspNetCore.Diagnostics;

namespace backend;

public class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken cancellationToken)
    {
        context.Response.StatusCode = 500;

        await context.Response.WriteAsJsonAsync("Something went wrong. Please try again later", cancellationToken);

        return true;
    }
}
