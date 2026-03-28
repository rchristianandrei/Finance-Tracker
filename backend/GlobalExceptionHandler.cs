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

        await context.Response.WriteAsJsonAsync(new
        {
            message = "Global error handled",
            error = exception.Message
        }, cancellationToken);

        return true;
    }
}
