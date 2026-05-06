using backend.Dtos;
using backend.Interfaces;
using backend.Interfaces.MySql;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[EnableRateLimiting("per-user")]
[Authorize(Policy = "AdminOnly")]
[Route("api/[controller]")]
public class UserController(IUserRepo _userRepo, ICurrentUserService _currentUserService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] QueryParameters query)
    {
        var (users, count) = await _userRepo.GetAll(query);
        return Ok(new { data = users.Select(u => u.ToDto()), totalCount = count });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var currentUserId = _currentUserService.Id();

        var user = await _userRepo.GetById(id);
        if (user == null) return NotFound();

        if (user.Id == currentUserId) return BadRequest();

        await _userRepo.Delete(user);
        return NoContent();
    }
}
