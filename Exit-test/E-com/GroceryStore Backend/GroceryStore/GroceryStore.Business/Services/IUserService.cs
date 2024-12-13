using GroceryStore.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GroceryStore.Business.Services
{
    public interface IUserService
    {
        Task<User> GetUserByEmail(string email);
        Task CreateUser(User user);
        Task<User> AuthenticateUser(string email, string password);
    }
}
