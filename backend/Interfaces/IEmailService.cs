namespace backend.Interfaces;

public interface IEmailService
{
    /// <summary>
    /// Sends an email with the otp
    /// </summary>
    /// <param name="toEmail">Receiver</param>
    /// <param name="origin">Client Host</param>
    /// <param name="token">User token</param>
    /// <returns></returns>
    Task SendVerifyAccountLink(string toEmail, string origin, string token);
}
