using backend;
using backend.Extensions;
using backend.Interfaces;
using backend.Interfaces.Utils;
using backend.Models;
using backend.Services;
using backend.Settings;
using Microsoft.AspNetCore.Identity;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Configure
var emailSettings = builder.Configuration.GetSection(nameof(EmailSettings)).Get<EmailSettings>() ?? throw new InvalidOperationException("EmailSettings section is missing or invalid");
builder.Services.AddSingleton(emailSettings);

// Extensions
builder.Services
    .AddJwt(builder.Configuration)
    .AddMySql(builder.Configuration)
    .AddRateLimiting();

// Identity
builder.Services.AddScoped<IPasswordHasher<LocalCredential>, PasswordHasher<LocalCredential>>();

// Services
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IOtpService, OtpService>();
builder.Services.AddScoped<ITokenService, TokenService>();

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
