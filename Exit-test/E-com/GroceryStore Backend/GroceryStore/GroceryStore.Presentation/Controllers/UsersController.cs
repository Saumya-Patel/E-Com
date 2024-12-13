using GroceryStore.Business.Services;
using GroceryStore.DAL.DTOs;
using GroceryStore.DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace GroceryStore.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly IUserService userService;

        public UsersController(IUserService _userService)
        {
            userService = _userService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] User user)
        {
            // Check if the user with the same email already exists
            if (await userService.GetUserByEmail(user.Email) != null)
            {
                return BadRequest("User with the same email already exists");
            }

            // Create the user
            await userService.CreateUser(user);

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] UserLoginRequest request)
        {
            var user = await userService.AuthenticateUser(request.Email, request.Password);

            if (user == null)
            {
                return BadRequest("Invalid email or password");
            }

            // Include the user ID in the response
            var userDto = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email
            };

            return Ok(userDto);
        }
    }
}
