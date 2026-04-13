using MimeKit;
using MailKit.Net.Smtp;
using backend.Settings;
using backend.Interfaces;

namespace backend.Services;

public class EmailService(EmailSettings _emailSettings) : IEmailService
{
    public async Task SendVerifyAccountLink(string toEmail, string otp)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Finance Tracker", _emailSettings.From));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = "Your verification code";
        message.Body = new TextPart("html")
        {
            Text = $"""
                <h1>Finance Tracker</h1>
                <h2>Verify Account</strong></h2>
                <p>Your Otp {otp} expires in 5 minutes.</p>
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
