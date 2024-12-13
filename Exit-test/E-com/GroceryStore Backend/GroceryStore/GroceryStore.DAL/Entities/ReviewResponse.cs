using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GroceryStore.DAL.Entities
{
    public class ReviewResponse
    {
        public int ProductId { get; set; }
        public string UserName { get; set; }
        public string Comment { get; set; }
    }
}
