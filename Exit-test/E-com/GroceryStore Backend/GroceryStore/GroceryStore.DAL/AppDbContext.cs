using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroceryStore.Business;
using GroceryStore.DAL.Entities;

namespace GroceryStore.DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed the default user role
            modelBuilder.Entity<UserRole>().HasData(new UserRole { Id = 1, RoleName = "User" });
            modelBuilder.Entity<UserRole>().HasData(new UserRole { Id = 2, RoleName = "Admin" });

            // Seed the admin user
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                FullName = "Admin User",
                Email = "admin@store.com",
                PhNo = "1234567890",
                Pwd = "Admin@123",
                Role = "Admin"
            });
        }
    }
}
