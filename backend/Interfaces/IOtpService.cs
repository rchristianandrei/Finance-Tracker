namespace backend.Interfaces;

public interface IOtpService
{
    /// <summary>
    /// Creates a short lived OTP
    /// </summary>
    /// <param name="key">unique identifier such as Email</param>
    /// <returns>6-digit value</returns>
    string GenerateOtp(string key);

    /// <summary>
    /// Returns the otp value if exists
    /// </summary>
    /// <param name="key">unique identifier such as Email</param>
    /// <returns>6-digit value if exists</returns>
    Task<string?> GetOtp(string key);

    /// <summary>
    /// Removes the otp based on key
    /// </summary>
    /// <param name="key">unique identifier such as Email</param>
    /// <returns></returns>
    Task RemoveOtp(string key);
}
