using GroceryStore.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GroceryStore.Business.Services
{
    public interface ICartService
    {
        Task<Cart> GetCartByUserId(int userId);
        Task<CartItem> AddOrUpdateCartItem(CartItem cartItem);
        Task CreateCart(Cart cart);
        Task<CartItem> GetCartItem(int userId, int productId);
        Task RemoveCartItem(int cartItemId);
        Task<int> GetCartItemQuantity(int userId, int productId);
        Task<List<UserCartItem>> GetCartItems(int cartId);
        Task<Cart> PlaceOrder(int userId);
        Task<List<MyOrder>> GetOrderList(int userId);
        Task<Cart> GetCartOrderByCartId(int cartId);
    }
}
