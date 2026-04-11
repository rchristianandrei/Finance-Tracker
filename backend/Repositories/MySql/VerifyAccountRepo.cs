using backend.Data;
using backend.Interfaces.MySql;
using backend.Interfaces.Utils;
using backend.Models;

namespace backend.Repositories.MySql;

public class VerifyAccountRepo(
    ApplicationDbContext _context,
    ITokenService _tokenService,
    IOtpService _otpService
) : IVerifyAccountRepo
{
    private readonly static int ExpiresInMinutes = 5;

    public async Task<(string token, string otp)> Create(string email)
    {
        var token = _tokenService.GenerateToken();
        var otp = _otpService.GenerateOtp();
        var verify = new VerifyAccount
        {
            Email = email,
            Token = token,
            Otp = otp,
            ExpiresAt = DateTime.Now.AddMinutes(ExpiresInMinutes)
        };
        await _context.VerifyAccounts.AddAsync(verify);
        await _context.SaveChangesAsync();

        return (token, otp);
    }
}
