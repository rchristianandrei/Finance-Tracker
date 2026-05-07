using backend.Enums;

namespace backend.Dtos.User;

public class UpdateUserDto
{
    public required int Id { get; set; }

    public required bool IsAdmin { get; set; } = false;

    public required string FirstName { get; set; } = string.Empty;

    public required string LastName { get; set; } = string.Empty;

    public required UserStatus Status { get; set; }
}
