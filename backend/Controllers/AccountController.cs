using backend.Attributes;
using backend.Dtos;
using backend.Dtos.Account;
using backend.Enums;
using backend.Interfaces.Sql;
using backend.Interfaces.Utils;
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
    IAccountRepo _accountRepo,
    IDefaultAccountRepo _defaultAccountRepo,
    ICategoryRepo _categoryRepo,
    ITransactionRepo _transactionService
) : ControllerBase
{
    [Transaction]
    [HttpPost]
    public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDto dto)
    {
        var userId = _currentUserService.Id();
        var accounts = await _accountRepo.GetAccounts(userId);
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
        var defaultAccount = await _defaultAccountRepo.GetById(userId);

        var accounts = await _accountRepo.GetAccounts(userId);
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
        var account = await _accountRepo.GetById(accountId);
        if (account == null) return NotFound("Account Not Found");

        var userId = _currentUserService.Id();
        if (account.OwnerId != userId) Forbid();

        var categories = await _categoryRepo.GetByAccountId(accountId);

        return Ok(categories.Select(c => c.ToDto()));
    }

    [HttpGet("{accountId}/transactions")]
    public async Task<IActionResult> Get(int accountId, [FromQuery] QueryParameters query)
    {
        var (transactions, count) = await _transactionService.GetAll(accountId, query);
        var dto = transactions.Select(t => t.ToDto());
        return Ok(new
        {
            totalCount = count,
            data = dto
        });
    }

    [HttpGet("{accountId}/dashboard")]
    public async Task<IActionResult> Dashboard(int accountId)
    {
        var expensesBreakdown = new Dictionary<string, double>();
        var expenses = 0.00;
        var income = 0.00;

        var transactions = await _transactionService.GetLastDays(accountId, 30);

        foreach (var transaction in transactions)
        {
            if (transaction.Type == TransactionType.INCOME)
            {
                income += transaction.Amount;
            }
            else if (transaction.Type == TransactionType.EXPENSE)
            {
                expenses += transaction.Amount;

                if (!expensesBreakdown.ContainsKey(transaction.Category.Name))
                    expensesBreakdown.Add(transaction.Category.Name, 0);

                expensesBreakdown[transaction.Category.Name] += transaction.Amount;
            }
        }

        var transactionDtos = transactions.Select(t => t.ToDto());

        return Ok(new
        {
            Balance = income - expenses,
            Income = income,
            Expenses = expenses,
            ExpensesBreakdown = expensesBreakdown.ToArray(),
            Transactions = transactionDtos
        });
    }

    [Transaction]
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
        await _accountRepo.Update(account);

        return Ok(account.ToDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAccount(int id)
    {
        var userId = _currentUserService.Id();
        var defaultAccount = await _defaultAccountRepo.GetById(userId);
        if (defaultAccount == null) return NotFound("Default account not found");

        var account = await _accountRepo.GetById(id);
        if (account == null) return NotFound();
        if (account.OwnerId != userId) return Forbid();

        if (defaultAccount.AccountId == account.Id)
            return BadRequest("Cannot delete default account");

        await _accountRepo.Delete(account);

        return Ok();
    }
}
