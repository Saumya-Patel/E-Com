using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GroceryStore.DAL.Entities
{
    public class UserCartItem
    {
        public int productId { get; set; }
        public string imageUrl { get; set; }
        public string description { get; set; }
        public int quantity { get; set; }
        public float total { get; set; }
    }
}
