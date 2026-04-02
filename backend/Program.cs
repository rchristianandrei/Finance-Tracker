using backend;
using backend.Data;
using backend.Extensions;
using backend.Interfaces;
using backend.Models;
using backend.Repositories;
using backend.Services;
using backend.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Configure
var jwtSettings = builder.Configuration.GetSection(nameof(EmailSettings)).Get<EmailSettings>() ?? throw new InvalidOperationException("EmailSettings section is missing or invalid");
builder.Services.AddSingleton(jwtSettings);

// MySql
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Extensions
builder.Services
    .AddJwt(builder.Configuration)
    .AddRedis(builder.Configuration);

// Identity
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IVerifyAccountService, VerifyAccountService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IUserRepo, UserRepo>();

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

app.UseExceptionHandler(options => { });

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
