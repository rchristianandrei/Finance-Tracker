using backend.Dtos;
using backend.Dtos.User;
using backend.Interfaces.Sql;
using backend.Interfaces.Utils;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[EnableRateLimiting("per-user")]
[Authorize(Policy = "AdminOnly")]
[Route("api/[controller]")]
public class UserController(
    IUserRepo _userRepo,
    ICurrentUserService _currentUserService,
    ITransactionRepo _transactionsRepo
) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] QueryParameters query)
    {
        var (users, count) = await _userRepo.GetAll(query);
        return Ok(new { data = users.Select(u => u.ToDto()), totalCount = count });
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var userId = _currentUserService.Id();
        var dashboardData = await _transactionsRepo.GetDashboard(userId);
        return Ok(dashboardData);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
    {
        var currentUserId = _currentUserService.Id();

        var user = await _userRepo.GetById(id);
        if (user == null) return NotFound();

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.UpdatedAt = DateTime.UtcNow;

        if (user.Id != currentUserId)
        {
            user.Status = dto.Status;
            user.IsAdmin = dto.IsAdmin;
        }

        await _userRepo.Update(user);

        return Ok(user.ToDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var currentUserId = _currentUserService.Id();

        var user = await _userRepo.GetById(id);
        if (user == null) return NotFound();

        if (user.Id == currentUserId) return BadRequest("Unable to delete yourself");

        await _userRepo.Delete(user);

        return NoContent();
    }
}
