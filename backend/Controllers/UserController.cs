using backend.Dtos;
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
public class UserController(IUserRepo _userRepo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] QueryParameters query)
    {
        var (users, count) = await _userRepo.GetAll(query);
        return Ok(new { data = users.Select(u => u.ToDto()), totalCount = count });
    }
}
