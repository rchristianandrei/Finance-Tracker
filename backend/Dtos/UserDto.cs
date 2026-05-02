
namespace backend.Dtos;

public class UserDto
{
    public required int Id { get; set; }

    public bool IsAdmin { get; set; } = false;

    public required string FirstName { get; set; } = string.Empty;

    public required string LastName { get; set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; set; }
}
