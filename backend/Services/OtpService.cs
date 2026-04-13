
using System.Security.Cryptography;
using backend.Interfaces.Utils;

namespace backend.Services;

public class OtpService : IOtpService
{
    public string GenerateOtp()
    {
        using var rng = RandomNumberGenerator.Create();
        byte[] data = new byte[4];
        rng.GetBytes(data);

        int value = BitConverter.ToInt32(data, 0);
        value = Math.Abs(value);

        int otp = value % 1000000;
        return otp.ToString("D6");
    }
}
