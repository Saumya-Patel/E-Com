using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GroceryStore.DAL.Entities
{
    public class MyOrder
    {
        public int Id { get; set; }
        public int TotalItems { get; set; }
        public DateTime Date { get; set; }
    }
}
