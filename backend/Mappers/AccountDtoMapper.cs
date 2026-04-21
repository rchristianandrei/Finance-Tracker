using backend.Dtos;
using backend.Models;

namespace backend.Mappers;

public static class AccountDtoMapper
{
    public static AccountDto ToDto(this Account account)
    {
        return new AccountDto
        {
            Id = account.Id,
            Name = account.Name,
            Balance = account.Balance
        };
    }
}
