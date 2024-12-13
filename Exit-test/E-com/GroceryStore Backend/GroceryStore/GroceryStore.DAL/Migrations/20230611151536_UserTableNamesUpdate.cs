using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GroceryStore.DAL.Migrations
{
    /// <inheritdoc />
    public partial class UserTableNamesUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "Users",
                newName: "Pwd");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Users",
                newName: "PhNo");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PhNo", "Pwd" },
                values: new object[] { "1234567890", "Admin@123" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Pwd",
                table: "Users",
                newName: "PhoneNumber");

            migrationBuilder.RenameColumn(
                name: "PhNo",
                table: "Users",
                newName: "Password");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "PhoneNumber" },
                values: new object[] { "Admin@123", "1234567890" });
        }
    }
}
