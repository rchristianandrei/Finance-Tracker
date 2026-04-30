using backend;
using backend.Extensions;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Extensions
builder.Services
    .AddJwt(builder.Configuration)
    .AddMySql(builder.Configuration)
    .AddRedis(builder.Configuration)
    .AddMongoDb(builder.Configuration)
    .AddRateLimiting();

// CORS
var policyName = builder.Services.ConfigureCors(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(policyName);

app.UseRateLimiter();

app.UseExceptionHandler(options => { });

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
