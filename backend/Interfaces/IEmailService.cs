namespace backend.Interfaces;

public interface IEmailService
{
    /// <summary>
    /// Sends an email with the otp
    /// </summary>
    /// <param name="toEmail">Receiver</param>
    /// <param name="otp">Account Otp</param>
    /// <returns></returns>
    Task SendVerifyAccountLink(string toEmail, string otp);
}
