
namespace backend.Dtos;

public class UserDto
{
    public required int Id { get; set; }

    public required string FirstName { get; set; } = string.Empty;

    public required string LastName { get; set; } = string.Empty;
}
