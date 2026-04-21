using backend.Dtos;
using backend.Interfaces;
using backend.Interfaces.Caching;
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
    IUserCache _userCache,
    IAccountRepo _accountRepo
) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDto dto)
    {
        var userId = _currentUserService.Id();
        var accounts = await _accountRepo.GetAccountsAsNoTracking(userId);
        if (accounts.Count >= 5) return BadRequest("You already have a maximum of 5 accounts");

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
        var userId = _currentUserService.Id();
        var account = await _accountRepo.GetById(id);
        if (account == null) return NotFound();
        if (account.OwnerId != userId) return Forbid();

        account.Name = dto.Name;

        if (dto.IsDefault)
        {
            var user = await _userCache.GetById(userId);
            if (user == null) return NotFound();

            user.DefaultAccountId = account.Id;
            await _userCache.Update(user);
        }
        await _accountRepo.Update(account);

        return Ok(account.ToDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAccount(int id)
    {
        var userId = _currentUserService.Id();
        var user = await _userCache.GetById(userId);
        if (user == null) return NotFound();

        var account = await _accountRepo.GetById(id);
        if (account == null) return NotFound();
        if (account.OwnerId != userId) return Forbid();

        if (user.DefaultAccountId == account.Id)
        {
            return BadRequest("Cannot delete default account");
        }

        await _accountRepo.Delete(account);

        return Ok();
    }
}
