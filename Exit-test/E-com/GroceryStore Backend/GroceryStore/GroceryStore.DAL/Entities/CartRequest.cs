using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GroceryStore.DAL.Entities
{
    public class CartRequest
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
    }
}
