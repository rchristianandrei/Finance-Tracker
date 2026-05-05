using backend.Attributes;
using backend.Dtos.Auth;
using backend.Interfaces;
using backend.Interfaces.Caching;
using backend.Interfaces.MySql;
using backend.Mappers;
using backend.Models;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[EnableRateLimiting("fixed")]
[Route("api/[controller]")]
public class AuthController(
    IUserCache _userCache,
    IGoogleCredentialRepo _googleCredRepo,
    IConfiguration _config,
    IJwtService _jwtService,
    ICurrentUserService _currentUserService,
    IAuthCookiesService _authCookiesService
) : ControllerBase
{
    [Transaction]
    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [_config["Google:ClientId"]]
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);

            var existingAcc = await _googleCredRepo.GetBySub(payload.Subject);
            User? user;

            if (existingAcc == null)
            {
                // Create User  
                user = new User
                {
                    FirstName = payload.GivenName,
                    LastName = payload.FamilyName
                };
                await _userCache.Create(user);

                // Create AuthProvider
                var sub = payload.Subject;
                var googleCreds = new GoogleCredential
                {
                    UserId = user.Id,
                    Email = payload.Email,
                    Subject = payload.Subject
                };
                await _googleCredRepo.Create(googleCreds);
            }
            else
            {
                user = await _userCache.GetById(existingAcc.UserId);
            }

            if (user == null) return BadRequest("User does not exists");

            var token = _jwtService.GenerateToken(user);
            _authCookiesService.AttachAuthCookies(token);

            return Ok(user.ToDto());
        }
        catch (InvalidJwtException)
        {
            return Unauthorized("Invalid Google token.");
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        _authCookiesService.RemoveAuthCookies();
        return Ok();
    }

    [Authorize]
    [EnableRateLimiting("per-user")]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var id = _currentUserService.Id();

        var user = await _userCache.GetById(id);
        if (user == null) return Unauthorized();

        return Ok(user.ToDto());
    }
}
