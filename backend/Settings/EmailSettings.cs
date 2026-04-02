namespace backend.Settings;

public class EmailSettings
{
    public string Host { get; set; } = null!;
    public string Port { get; set; } = null!;
    public string From { get; set; } = null!;
    public string Password { get; set; } = null!;
}
