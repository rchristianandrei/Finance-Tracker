using System.ComponentModel.DataAnnotations;

namespace backend.DataAnnotations;

public class GreaterThanZeroAttribute : ValidationAttribute
{
    public override bool IsValid(object? value)
    {
        if (value == null) return true; // handle [Required] separately

        if (double.TryParse(value.ToString(), out var number))
        {
            return number > 0;
        }

        return false;
    }
}
