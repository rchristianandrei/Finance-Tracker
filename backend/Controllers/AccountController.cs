using backend.Dtos;
using backend.Interfaces;
using backend.Interfaces.MySql;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AccountController(
    ICurrentUserService _currentUserService,
    IAccountRepo _accountRepo
) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDto dto)
    {
        var userId = _currentUserService.Id();

        var account = new Account
        {
            Name = dto.Name,
            OwnerId = userId
        };
        await _accountRepo.Create(account);

        return Ok(account.ToDto());
    }

    [HttpGet]
    public async Task<IActionResult> GetAccounts()
    {
        var userId = _currentUserService.Id();
        var accounts = await _accountRepo.GetAccountsAsNoTracking(userId);
        var dtos = accounts.Select(a => a.ToDto());
        return Ok(dtos);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAccount(int id, [FromBody] UpdateAccountDto dto)
    {
        var account = await _accountRepo.GetById(id);
        if (account == null) return NotFound();

        account.Name = dto.Name;
        await _accountRepo.Update(account);

        return Ok(account.ToDto());
    }
}
