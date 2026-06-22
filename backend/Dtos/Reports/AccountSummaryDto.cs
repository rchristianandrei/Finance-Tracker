namespace backend.Dtos.Reports;

public class AccountSummaryDto
{
    public int AccountId { get; set; }
    public string AccountName { get; set; } = string.Empty;

    public double Amount { get; set; }
    public double Percentage { get; set; }

}
