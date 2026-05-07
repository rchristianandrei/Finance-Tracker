using MimeKit;
using MailKit.Net.Smtp;
using backend.Settings;
using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class EmailService(EmailSettings _emailSettings) : IEmailService
{
    private async Task SendEmail(string toEmail, string subject, string text)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Finance Tracker", _emailSettings.From));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = subject;
        message.Body = new TextPart("html")
        {
            Text = text
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

    public async Task SendRegisterNotification(User user)
    {
        await this.SendEmail(_emailSettings.From, "User for Approval",
        $"""
            <h1>Finance Tracker</h1>
            <h2><strong>New user created</strong></h2>
            <p>{user.LastName}, {user.FirstName} [{user.Id}]</p>
            <p>Created at {user.CreatedAt.ToString("MMMM dd, yyyy")}</p>
        """);
    }

    public async Task SendApprovalNotification(string toEmail)
    {
        await this.SendEmail(toEmail, "User Update",
        $"""
            <h1>Finance Tracker</h1>
            <h2><strong>Registration Approved</strong></h2>
            <p>You may now use the application</p>
        """);
    }

    public async Task SendUserDeleteNotification(string toEmail)
    {
        await this.SendEmail(toEmail, "User Removed",
        $"""
            <h1>Finance Tracker</h1>
            <p>Your account has been deleted</p>
        """);
    }
}
