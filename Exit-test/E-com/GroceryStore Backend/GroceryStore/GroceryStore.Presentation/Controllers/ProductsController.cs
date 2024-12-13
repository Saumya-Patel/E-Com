using GroceryStore.Business;
using GroceryStore.Business.Services;
using GroceryStore.DAL;
using GroceryStore.DAL.DTOs;
using GroceryStore.DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GroceryStore.Presentation.Controllers
{
    [ApiController]
    [Route("api")]
    public class ProductsController : Controller
    {
        private readonly AppDbContext dbContext;
        private readonly ICartService cartService;

        public ProductsController(AppDbContext _dbContext, ICartService _cartService)
        {
            dbContext = _dbContext;
            cartService = _cartService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await dbContext.Products.ToListAsync();
            return Ok(products);
        }

        [HttpPost]
        public async Task<IActionResult> AddProduct([FromBody] Product productRequest)
        {
            await dbContext.Products.AddAsync(productRequest);
            await dbContext.SaveChangesAsync();

            return Ok(productRequest);
        }

        [HttpGet]
        [Route("product-details/{UserId}/{ProductId}")]
        public async Task<IActionResult> GetProduct([FromRoute] CartRequest request)
        {
            var product = await dbContext.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId);

            if (product == null)
            {
                return BadRequest("No item found");
            }

            int items = 0;

            if (request.UserId != 0)
            {
                var cartItem = await dbContext.CartItems
                    .FirstOrDefaultAsync(ci => ci.Cart.UserId == request.UserId
                    && ci.ProductId == request.ProductId
                    && ci.Cart.PlacedOrder == false);

                if (cartItem != null)
                {
                    items = cartItem.Quantity;
                }
            }

            var productDto = new ProductDto
            {
                Id = product.Id,
                ProductName = product.ProductName,
                Description = product.Description,
                Category = product.Category,
                Price = product.Price,
                Discount = product.Discount,
                ImageUrl = product.ImageUrl,
                InStock = product.InStock,
                Specification = product.Specification,
                ItemsAdded = items
            };

            return Ok(productDto);
        }

        [HttpPut]
        [Route("product-details/{id:int}")]
        public async Task<IActionResult> GetProduct([FromRoute] int id, Product updateProductRequest)
        {
            var product = await dbContext.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            product.ProductName = updateProductRequest.ProductName;
            product.Description = updateProductRequest.Description;
            product.Price = updateProductRequest.Price;
            product.ImageUrl = updateProductRequest.ImageUrl;
            product.InStock = updateProductRequest.InStock;

            await dbContext.SaveChangesAsync();
            return Ok(product);
        }

        [HttpDelete]
        [Route("product-details/{id:int}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await dbContext.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            dbContext.Products.Remove(product);
            await dbContext.SaveChangesAsync();
            return Ok(product);
        }

        [HttpPost]
        [Route("comments")]
        public async Task<IActionResult> PostComment([FromBody] Review comment)
        {
            var user = await dbContext.Users.FindAsync(comment.UserId);
            if (user == null)
            {
                return BadRequest("Invalid UserId");
            }

            dbContext.Reviews.Add(comment);
            await dbContext.SaveChangesAsync();

            var response = new ReviewResponse
            {
                ProductId = comment.ProductId,
                UserName = user.FullName,
                Comment = comment.Comment
            };

            return Ok(response);
        }

        [HttpGet]
        [Route("comments/{id:int}")]
        public async Task<IActionResult> GetComments([FromRoute] int id)
        {
            var comments = await dbContext.Reviews
            .Where(r => r.ProductId == id)
            .Join(dbContext.Users, r => r.UserId, u => u.Id, (r, u) => new ReviewResponse
            {
                ProductId = r.ProductId,
                UserName = u.FullName,
                Comment = r.Comment
            }).ToListAsync();

            return Ok(comments);
        }
    }
}
