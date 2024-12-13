using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GroceryStore.DAL.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public float Price { get; set; }
        public string ImageUrl { get; set; }
        public int InStock { get; set; }
        public float Discount { get; set; }
        public string Category { get; set; }
        public string Specification { get; set; }
        public int ItemsAdded { get; set; }
    }
}
