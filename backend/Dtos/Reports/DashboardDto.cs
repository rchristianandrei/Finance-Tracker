namespace backend.Dtos.Reports;

public class DashboardDto
{
    public double TotalIncome { get; set; }
    public double TotalExpense { get; set; }
    public double NetAmount { get; set; }

    public List<AccountSummaryDto> IncomeByAccount { get; set; } = [];
    public List<AccountSummaryDto> ExpenseByAccount { get; set; } = [];

    public List<AccountBalanceDto> Accounts { get; set; } = [];
}
