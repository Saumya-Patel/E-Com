using GroceryStore.DAL;
using GroceryStore.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GroceryStore.Business.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext dbContext;

        public UserService(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task CreateUser(User user)
        {
            UserRole defaultRole = await dbContext.UserRoles.FirstOrDefaultAsync(r => r.RoleName == "User");

            if (string.IsNullOrEmpty(user.Role))
            {
                user.Role = defaultRole.RoleName;
            }

            await dbContext.Users.AddAsync(user);
            await dbContext.SaveChangesAsync();
        }

        public async Task<User> AuthenticateUser(string email, string password)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);

            if(user != null && password == user.Pwd)
            {
                return user;
            }

            return null;
        }
    }
}
