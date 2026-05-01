using backend.Dtos;
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
            FirstName = user.FirstName,
            LastName = user.LastName,
        };
    }
}
