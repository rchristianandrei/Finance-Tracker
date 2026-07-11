namespace backend.Dtos.Reports;

public class DashboardDto
{
    public double TotalIncome { get; set; }
    public double TotalExpense { get; set; }
    public double NetAmount { get; set; }

    public List<CategoryAmountDto> IncomeByCategory { get; set; } = [];
    public List<CategoryAmountDto> ExpenseByCategory { get; set; } = [];
}
