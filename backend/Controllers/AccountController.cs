using backend.Interfaces;
using backend.Interfaces.MySql;
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
    [HttpGet]
    public async Task<IActionResult> GetAccounts()
    {
        var userId = _currentUserService.Id();
        var accounts = await _accountRepo.GetAccounts(userId);
        var dtos = accounts.Select(a => new
        {
            a.Id,
            a.Name,
            a.Balance
        });
        return Ok(dtos);
    }
}
