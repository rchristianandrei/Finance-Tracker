namespace backend.Dtos.Account;

public class AccountDto
{
    public int Id { get; set; }

    public required string Name { get; set; } = string.Empty;

    public double Balance { get; set; }
}
