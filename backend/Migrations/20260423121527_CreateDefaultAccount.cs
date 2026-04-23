using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class CreateDefaultAccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Accounts_DefaultAccountId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_DefaultAccountId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DefaultAccountId",
                table: "Users");

            migrationBuilder.CreateTable(
                name: "DefaultAccounts",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    AccountId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DefaultAccounts", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_DefaultAccounts_Accounts_UserId",
                        column: x => x.UserId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DefaultAccounts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DefaultAccounts");

            migrationBuilder.AddColumn<int>(
                name: "DefaultAccountId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_DefaultAccountId",
                table: "Users",
                column: "DefaultAccountId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Accounts_DefaultAccountId",
                table: "Users",
                column: "DefaultAccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
