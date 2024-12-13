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
    public class CartService : ICartService
    {
        private readonly AppDbContext dbContext;

        public CartService(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        public async Task<Cart> GetCartByUserId(int userId)
        {
            return await dbContext.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId && c.PlacedOrder == false);
        }

        public async Task<Cart> GetCartOrderByCartId(int cartId)
        {
            return await dbContext.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.CartId == cartId);
        }

        public async Task<CartItem> AddOrUpdateCartItem(CartItem cartItem)
        {
            var existingCartItem = await dbContext.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cartItem.CartId && ci.ProductId == cartItem.ProductId);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity = cartItem.Quantity;
            }
            else
            {
                dbContext.CartItems.Add(cartItem);
            }

            await dbContext.SaveChangesAsync();
            return cartItem;
        }

        public async Task CreateCart(Cart cart)
        {
            await dbContext.Carts.AddAsync(cart);
            await dbContext.SaveChangesAsync();
        }

        public async Task<CartItem> GetCartItem(int userId, int productId)
        {
            return await dbContext.CartItems
                .FirstOrDefaultAsync(ci => ci.Cart.UserId == userId && ci.ProductId == productId);
        }

        public async Task RemoveCartItem(int cartItemId)
        {
            var cartItem = await dbContext.CartItems.FindAsync(cartItemId);

            if (cartItem != null)
            {
                dbContext.CartItems.Remove(cartItem);
                await dbContext.SaveChangesAsync();
            }
        }

        public async Task<int> GetCartItemQuantity(int userId, int productId)
        {
            var cart = await GetCartByUserId(userId);

            if (cart == null)
            {
                return 0;
            }

            var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == productId);

            if (cartItem == null)
            {
                return 0;
            }

            return cartItem.Quantity;
        }

        public async Task<List<UserCartItem>> GetCartItems(int cartId)
        {
            var cartItems = await dbContext.CartItems
                .Include(ci => ci.Product) // Eagerly load the Product entity
                .Where(ci => ci.CartId == cartId)
                .ToListAsync();

            return cartItems.Select(ci => new UserCartItem
            {
                productId = ci.ProductId,
                imageUrl = ci.Product.ImageUrl,
                description = ci.Product.Description,
                quantity = ci.Quantity,
                total = ci.Product.Price * ci.Quantity * (1 - ci.Product.Discount / 100)
            }).ToList();
        }

        public async Task<Cart> PlaceOrder(int userId)
        {
            var cart = await dbContext.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId && c.PlacedOrder == false);

            if (cart != null)
            {
                foreach (var cartItem in cart.CartItems)
                {
                    var product = cartItem.Product;
                    if (product.InStock >= cartItem.Quantity) // Check if there is enough stock
                    {
                        product.InStock -= cartItem.Quantity; // Deduct the ordered quantity from the stock
                    }
                }

                cart.PlacedOrder = true;
                cart.DateTime = DateTime.Now;
                await dbContext.SaveChangesAsync();
            }

            return cart;
        }

        public async Task<List<MyOrder>> GetOrderList(int userId)
        {
            var orders = await dbContext.Carts
                .Where(c => c.UserId == userId && c.PlacedOrder == true)
                .ToListAsync();

            var orderList = new List<MyOrder>();

            foreach (var cart in orders)
            {
                var totalItems = await dbContext.CartItems
                    .Where(ci => ci.CartId == cart.CartId)
                    .SumAsync(ci => ci.Quantity);

                if (totalItems > 0)
                {
                    orderList.Add(new MyOrder
                    {
                        Id = cart.CartId,
                        TotalItems = totalItems,
                        Date = cart.DateTime
                    });
                }
            }

            return orderList;
        }
    }
}
