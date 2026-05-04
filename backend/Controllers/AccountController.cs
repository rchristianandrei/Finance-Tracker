using backend.Attributes;
using backend.Dtos;
using backend.Interfaces;
using backend.Interfaces.Caching;
using backend.Interfaces.MySql;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[Authorize]
[ApiController]
[EnableRateLimiting("per-user")]
[Route("api/[controller]")]
public class AccountController(
    ICurrentUserService _currentUserService,
    IAccountCacheService _accountCache,
    IDefaultAccountRepo _defaultAccountRepo,
    ICategoryRepo _categoryRepo
) : ControllerBase
{
    [Transaction]
    [HttpPost]
    public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDto dto)
    {
        var userId = _currentUserService.Id();
        var accounts = await _accountCache.GetAccounts(userId);
        if (accounts.Count >= 5) return BadRequest("You already have a maximum of 5 accounts");

        var account = new Account
        {
            Name = dto.Name,
            OwnerId = userId
        };
        await _accountCache.Create(userId, account);

        return Ok(account.ToDto());
    }

    [HttpGet]
    public async Task<IActionResult> GetAccounts()
    {
        var userId = _currentUserService.Id();
        var defaultAccount = await _defaultAccountRepo.GetById(userId);

        var accounts = await _accountCache.GetAccounts(userId);
        var dtos = accounts.Select(a => a.ToDto());
        var output = new
        {
            Accounts = dtos,
            DefaultAccount = dtos.FirstOrDefault(a => a.Id == defaultAccount?.AccountId)
        };

        return Ok(output);
    }

    [HttpGet("{accountId}/categories")]
    public async Task<IActionResult> GetCategories(int accountId)
    {
        var account = await _accountCache.GetById(accountId);
        if (account == null) return NotFound("Account Not Found");

        var userId = _currentUserService.Id();
        if (account.OwnerId != userId) Forbid();

        var categories = await _categoryRepo.GetByAccountId(accountId);

        return Ok(categories.Select(c => c.ToDto()));
    }

    [Transaction]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAccount(int id, [FromBody] UpdateAccountDto dto)
    {
        var userId = _currentUserService.Id();

        var account = await _accountCache.GetById(id);
        if (account == null) return NotFound();
        if (account.OwnerId != userId) return Forbid();

        account.Name = dto.Name;

        if (dto.IsDefault)
        {
            var defaultAccount = await _defaultAccountRepo.GetById(userId);
            if (defaultAccount == null)
            {
                defaultAccount = new DefaultAccount
                {
                    UserId = userId,
                    AccountId = account.Id
                };
                await _defaultAccountRepo.Create(defaultAccount);
            }
            else
            {
                defaultAccount.AccountId = account.Id;
                await _defaultAccountRepo.Update(defaultAccount);
            }
        }
        await _accountCache.Update(userId, account);

        return Ok(account.ToDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAccount(int id)
    {
        var userId = _currentUserService.Id();
        var defaultAccount = await _defaultAccountRepo.GetById(userId);
        if (defaultAccount == null) return NotFound("Default account not found");

        var account = await _accountCache.GetById(id);
        if (account == null) return NotFound();
        if (account.OwnerId != userId) return Forbid();

        if (defaultAccount.AccountId == account.Id)
            return BadRequest("Cannot delete default account");

        await _accountCache.Delete(userId, account);

        return Ok();
    }
}
