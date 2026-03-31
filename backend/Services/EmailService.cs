using MimeKit;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using backend.Settings;
using backend.Interfaces;

namespace backend.Services;

public class EmailService(IOptions<EmailSettings> _optionEmailSettings) : IEmailService
{
    private readonly EmailSettings _emailSettings = _optionEmailSettings.Value;

    public async Task SendVerifyAccountLink(string toEmail, string origin, string token)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Finance Tracker", _emailSettings.From));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = "Your verification code";
        message.Body = new TextPart("html")
        {
            Text = $"""
                <h2>Finance Tracker Account Created</strong></h2>
                <p>This link expires in 5 minutes.</p>
                <button><a target="_blank" href="{origin}/api/auth/verify-account/{token}">Verify Account</a></button>
            """
        };

        using var client = new SmtpClient();
        try
        {
            await client.ConnectAsync(_emailSettings.Host, int.Parse(_emailSettings.Port), true);
            await client.AuthenticateAsync(_emailSettings.From, _emailSettings.Password);
            await client.SendAsync(message);
        }
        finally
        {
            await client.DisconnectAsync(true);
        }
    }
}
