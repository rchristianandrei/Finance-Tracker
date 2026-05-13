using backend.Dtos.Category;
using backend.Models;

namespace backend.Mappers;

public static class CategoryDtoMapper
{
    public static CategoryDto ToDto(this Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Type = category.Type,
            Name = category.Name
        };
    }
}
