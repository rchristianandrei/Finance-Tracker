using backend.Dtos.User;
using backend.Models;

namespace backend.Mappers;

public static class UserDtoMapper
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            Id = user.Id,
            IsAdmin = user.IsAdmin,
            Status = user.Status,
            FirstName = user.FirstName,
            LastName = user.LastName,
            CreatedAt = user.CreatedAt
        };
    }
}
