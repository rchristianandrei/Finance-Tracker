using backend.Data;
using backend.Dtos;
using backend.Interfaces.Sql;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Sql;

public class UserRepo(
    ApplicationDbContext _context,
    IAccountRepo _accountRepo,
    IDefaultAccountRepo _defaultAccountRepo) : IUserRepo
{
    public async Task<User?> GetById(int id)
    {
        var user = await _context.Users.FindAsync(id);
        return user;
    }

    public async Task<(ICollection<User> users, long count)> GetAll(QueryParameters query)
    {
        var queryable = _context.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = $"%{query.Search}%";

            queryable = queryable.Where(u =>
                EF.Functions.ILike(u.FirstName, search) ||
                EF.Functions.ILike(u.LastName, search) ||
                EF.Functions.ILike(u.Id.ToString(), search)
            );
        }

        if (query.StartDate.HasValue)
        {
            queryable = queryable.Where(t => t.CreatedAt >= query.StartDate.Value);
        }

        if (query.EndDate.HasValue)
        {
            var end = query.EndDate.Value.AddDays(1).AddTicks(-1);
            queryable = queryable.Where(t => t.CreatedAt <= end);
        }

        var count = await queryable.LongCountAsync();

        var users = await queryable
            .OrderByDescending(t => t.CreatedAt)
            .Skip((query.PageOrDefault - 1) * query.PageSizeOrDefault)
            .Take(query.PageSizeOrDefault)
            .AsNoTracking()
            .ToListAsync();

        return (users, count);
    }

    public async Task Create(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        var account = new Account
        {
            OwnerId = user.Id,
            Owner = user,
            Name = "Default Account",
            Balance = 0,
        };
        await _accountRepo.Create(account);

        var defaultAccount = new DefaultAccount
        {
            UserId = user.Id,
            AccountId = account.Id
        };
        await _defaultAccountRepo.Create(defaultAccount);
    }

    public async Task Update(User user)
    {
        await _context.SaveChangesAsync();
    }

    public async Task Delete(User user)
    {
        _context.Remove(user);
        await _context.SaveChangesAsync();
    }
}
