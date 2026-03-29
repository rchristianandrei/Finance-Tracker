namespace backend.Interfaces;

public interface IEmailService
{
    /// <summary>
    /// Sends an email with the otp
    /// </summary>
    /// <param name="toEmail">Receiver</param>
    /// <param name="otp"></param>
    /// <returns></returns>
    Task SendOtpAsync(string toEmail, string otp);
}
