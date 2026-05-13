using backend.Models;

namespace backend.Interfaces;

public interface IEmailService
{
    Task SendRegisterNotification(User user);

    Task SendApprovalNotification(string toEmail);

    Task SendUserDeleteNotification(string toEmail);
}
