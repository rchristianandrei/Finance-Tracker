using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveLocalCredential : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VerifyAccounts_LocalCredentials_Email",
                table: "VerifyAccounts");

            migrationBuilder.DropTable(
                name: "LocalCredentials");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LocalCredentials",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    IsVerified = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocalCredentials", x => x.UserId);
                    table.UniqueConstraint("AK_LocalCredentials_Email", x => x.Email);
                    table.ForeignKey(
                        name: "FK_LocalCredentials_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LocalCredentials_Email",
                table: "LocalCredentials",
                column: "Email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_VerifyAccounts_LocalCredentials_Email",
                table: "VerifyAccounts",
                column: "Email",
                principalTable: "LocalCredentials",
                principalColumn: "Email",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
