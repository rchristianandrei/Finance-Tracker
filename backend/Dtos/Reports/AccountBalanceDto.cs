namespace backend.Dtos.Reports;

public class AccountBalanceDto
{
    public int AccountId { get; set; }
    public string AccountName { get; set; } = string.Empty;

    public double TotalIncome { get; set; }
    public double TotalExpense { get; set; }
    public double Balance => TotalIncome - TotalExpense;
}