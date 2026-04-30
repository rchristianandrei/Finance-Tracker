using backend.Data;
using backend.Interfaces.MySql;
using backend.Interfaces.Utils;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.MySql;

public class VerifyAccountRepo(
    ApplicationDbContext _context,
    ITokenService _tokenService,
    IOtpService _otpService
) : IVerifyAccountRepo
{
    private readonly static int ExpiresInMinutes = 1;

    public async Task<VerifyAccount> Create(string email)
    {
        var token = _tokenService.GenerateToken();
        var otp = _otpService.GenerateOtp();
        var verify = new VerifyAccount
        {
            Email = email,
            Token = token,
            Otp = otp,
            ExpiresAt = DateTime.UtcNow.AddMinutes(ExpiresInMinutes)
        };
        await _context.VerifyAccounts.AddAsync(verify);
        await _context.SaveChangesAsync();

        return verify;
    }

    public async Task<VerifyAccount?> GetByEmail(string email)
    {
        var verify = await _context.VerifyAccounts.FindAsync(email);
        return verify;
    }

    public async Task<VerifyAccount?> GetByToken(string token)
    {
        var verify = await _context.VerifyAccounts.FirstOrDefaultAsync(v => v.Token == token);
        return verify;
    }

    public async Task RenewOtp(VerifyAccount verify)
    {
        var otp = _otpService.GenerateOtp();
        verify.Otp = otp;
        verify.ExpiresAt = DateTime.UtcNow.AddMinutes(ExpiresInMinutes);
        await _context.SaveChangesAsync();
    }

    public async Task Delete(VerifyAccount verify)
    {
        _context.VerifyAccounts.Remove(verify);
        await _context.SaveChangesAsync();
    }
}
