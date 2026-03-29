using backend;
using backend.Data;
using backend.Interfaces;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// MySql
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Redis
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration["Redis:ConnectionString"];
    options.InstanceName = "FinanceTracker:"; // optional key prefix
});

// Identity
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

// Services
builder.Services.AddSingleton<ICacheService, RedisCacheService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IOtpService, OtpService>();
builder.Services.AddScoped<IEmailService, EmailService>();

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

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
