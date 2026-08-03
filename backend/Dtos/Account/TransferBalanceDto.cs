namespace backend.Dtos.Account;

public class TransferBalanceDto
{
    public int FromAccountId { get; set; }
    public int ToAccountId { get; set; }
    public double Amount { get; set; }
}
