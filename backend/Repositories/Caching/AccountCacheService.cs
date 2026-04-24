using backend.Interfaces;
using backend.Interfaces.Caching;
using backend.Interfaces.MySql;
using backend.Models;

namespace backend.Repositories.Caching;

public class AccountCacheService(IAccountRepo _accountRepo,
    ICacheService _cacheService
) : IAccountCacheService
{
    private static string ModifyIndividualKey(int key) => $"account:{key}";
    private static string ModifyGroupKey(int key) => $"accounts:{key}";
    private readonly static TimeSpan TTL = TimeSpan.FromMinutes(5);

    public async Task<Account?> GetById(int id)
    {
        var cached = await _cacheService.GetAsync<Account>(ModifyIndividualKey(id));
        if (cached != null) return cached;

        var user = await _accountRepo.GetById(id);
        if (user != null) await _cacheService.SetAsync(ModifyIndividualKey(id), user, TTL);

        return user;
    }

    public async Task<ICollection<Account>> GetAccounts(int userId)
    {
        var cached = await _cacheService.GetAsync<Account[]>(ModifyGroupKey(userId));
        if (cached != null) return cached;

        var accounts = await _accountRepo.GetAccountsAsNoTracking(userId);
        if (accounts.Count > 0) await _cacheService.SetAsync(ModifyGroupKey(userId), accounts, TTL);

        return accounts;
    }

    public async Task Create(Account account)
    {
        await _accountRepo.Create(account);
        await _cacheService.SetAsync(ModifyIndividualKey(account.Id), account, TTL);
    }

    public async Task Update(Account account)
    {
        await _accountRepo.Update(account);
        await _cacheService.SetAsync(ModifyIndividualKey(account.Id), account, TTL);
    }

    public async Task Delete(Account account)
    {
        await _accountRepo.Delete(account);
        await _cacheService.RemoveAsync(ModifyIndividualKey(account.Id));
        await _cacheService.RemoveAsync(ModifyGroupKey(account.Id));
    }
}
