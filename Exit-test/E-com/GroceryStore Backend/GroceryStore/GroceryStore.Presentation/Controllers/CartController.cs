using GroceryStore.Business.Services;
using GroceryStore.DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GroceryStore.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : Controller
    {
        private readonly ICartService cartService;

        public CartController(ICartService _cartService)
        {
            cartService = _cartService;
        }

        [HttpPost("add-to-cart")]
        public async Task<IActionResult> AddToCart([FromBody] CartRequest request)
        {
            var userId = request.UserId;
            var cart = await cartService.GetCartByUserId(userId);

            if (cart == null)
            {
                // Create a new cart if the user doesn't have one
                cart = new Cart { UserId = userId };
                await cartService.CreateCart(cart);
            }

            // Check if the product already exists in the cart
            var cartItem = cart.CartItems?.FirstOrDefault(ci => ci.ProductId == request.ProductId);

            if (cartItem == null)
            {
                // If the product doesn't exist in the cart, create a new cart item
                cartItem = new CartItem
                {
                    CartId = cart.CartId,
                    ProductId = request.ProductId,
                    Quantity = 1
                };
            }
            else
            {
                // If the product already exists, update the quantity
                cartItem.Quantity += 1;
            }

            await cartService.AddOrUpdateCartItem(cartItem);

            return Ok(cartItem.Quantity);
        }

        [HttpPost("decrement-qnty")]
        public async Task<IActionResult> DecrementCartItemQuantity(CartRequest request)
        {
            var cartItem = await cartService.GetCartItem(request.UserId, request.ProductId);

            if (cartItem.Quantity > 1)
            {
                cartItem.Quantity--;
                await cartService.AddOrUpdateCartItem(cartItem);
            }
            else
            {
                await cartService.RemoveCartItem(cartItem.CartItemId);
            }

            return Ok(cartItem.Quantity);
        }

        [HttpGet("view-cart/{userId:int}")]
        public async Task<IActionResult> GetCart([FromRoute] int userId)
        {
            var cart = await cartService.GetCartByUserId(userId);

            if (cart == null || cart.PlacedOrder == true)
            {
                // If the cart doesn't exist, return an empty response or appropriate error message
                return Ok(new List<CartItem>());
            }

            // Retrieve the cart items for the cart
            var cartItems = await cartService.GetCartItems(cart.CartId);

            return Ok(cartItems);
        }

        [HttpPost("place-order/{userId:int}")]
        public async Task<IActionResult> PlaceOrder([FromRoute] int userId)
        {
            var cart = await cartService.PlaceOrder(userId);
            return Ok(cart);
        }

        [HttpGet("my-orders/{userId:int}")]
        public async Task<IActionResult> MyOrders([FromRoute] int userId)
        {
            var orderList = await cartService.GetOrderList(userId);
            return Ok(orderList);
        }

        [HttpGet("view-order/{cartId:int}")]
        public async Task<IActionResult> ViewOrder([FromRoute] int cartId)
        {
            var cart = await cartService.GetCartOrderByCartId(cartId);

            if (cart == null)
            {
                // If the cart doesn't exist, return an empty response or appropriate error message
                return Ok(new List<CartItem>());
            }

            // Retrieve the cart items for the cart
            var cartItems = await cartService?.GetCartItems(cartId);

            return Ok(cartItems);
        }
    }
}
