using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Transactions",
                type: "integer",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM "Transactions"
                        WHERE "CategoryId" IS NULL
                    ) THEN
                        RAISE EXCEPTION 'Cannot migrate Transaction.Type: some transactions have no category.';
                    END IF;

                    IF EXISTS (
                        SELECT 1
                        FROM "Transactions" t
                        LEFT JOIN "Categories" c ON t."CategoryId" = c."Id"
                        WHERE c."Id" IS NULL
                    ) THEN
                        RAISE EXCEPTION 'Cannot migrate Transaction.Type: some transactions reference a missing category.';
                    END IF;
                END $$;
                """);

            migrationBuilder.Sql("""
                UPDATE "Transactions" AS t
                SET "Type" = c."Type"
                FROM "Categories" AS c
                WHERE t."CategoryId" = c."Id";
                """);

            migrationBuilder.Sql("""
                UPDATE "Transactions"
                SET "FromAccountId" = "ToAccountId",
                    "ToAccountId" = NULL
                WHERE "Type" = 1;
                """);

            migrationBuilder.AlterColumn<int>(
                name: "Type",
                table: "Transactions",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "Transactions"
                SET "ToAccountId" = "FromAccountId",
                    "FromAccountId" = NULL
                WHERE "Type" = 1;
                """);

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Transactions");
        }
    }
}
