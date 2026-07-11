namespace backend.Dtos.Reports;

public class CategoryAmountDto
{
    public string Category { get; set; } = string.Empty;
    public double Amount { get; set; }
    public double Percentage { get; set; }
}
