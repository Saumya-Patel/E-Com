using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GroceryStore.DAL.Entities
{
    public class Cart
    {
        [Key]
        public int CartId { get; set; }
        public int UserId { get; set; }
        public DateTime DateTime { get; set; }
        public bool PlacedOrder { get; set; } = false;

        public virtual User User { get; set; }
        public virtual ICollection<CartItem> CartItems { get; set;}
    }
}
