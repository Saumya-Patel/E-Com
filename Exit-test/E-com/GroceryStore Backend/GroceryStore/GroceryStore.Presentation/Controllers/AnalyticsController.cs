using GroceryStore.DAL;
using GroceryStore.DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace GroceryStore.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : Controller
    {
        private readonly AppDbContext dbContext;
        private readonly IConfiguration configuration;

        public AnalyticsController(AppDbContext _dbContext, IConfiguration _configuration)
        {
            dbContext = _dbContext;
            configuration = _configuration;
        }

        [HttpGet]
        [Route("most-ordered-products")]
        public async Task<IActionResult> GetMostOrderedProducts([FromRoute] int year, [FromRoute] int month)
        {
            List<MostOrderedProduct> products = new List<MostOrderedProduct>();

            using (var connection = new SqlConnection(configuration.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("GetTopOrderedProducts", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Year", year);
                    command.Parameters.AddWithValue("@Month", month);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            MostOrderedProduct product = new MostOrderedProduct();
                            product.ProductId = Convert.ToInt32(reader["ProductId"]);
                            product.ProductName = reader["ProductName"].ToString();
                            product.Quantity = Convert.ToInt32(reader["Quantity"]);

                            products.Add(product);
                        }
                    }
                }
            }

            return Ok(products);
        }
    }
}
