namespace backend.Dtos.Account;

// return Ok(accounts.Select(a => new { a.Id, a.Name, a.Balance, a.CreatedAt, a.UserId }));
public class AccountDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public double Balance { get; set; }
}
