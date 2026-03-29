using backend.Interfaces;
using MailKit.Net.Smtp;
using MimeKit;

namespace backend.Services;

public class EmailService(IConfiguration _config) : IEmailService
{
    public async Task SendOtpAsync(string toEmail, string otp)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Finance Tracker", _config["Email:From"]));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = "Your verification code";
        message.Body = new TextPart("html")
        {
            Text = $"""
                <h2>Your OTP is: <strong>{otp}</strong></h2>
                <p>This code expires in 5 minutes.</p>
            """
        };

        using var client = new SmtpClient();
        try
        {
            await client.ConnectAsync(_config["Email:Host"], int.Parse(_config["Email:Port"]!), true);
            await client.AuthenticateAsync(_config["Email:From"], _config["Email:Password"]);
            await client.SendAsync(message);
        }
        finally
        {
            await client.DisconnectAsync(true);
        }
    }
}
