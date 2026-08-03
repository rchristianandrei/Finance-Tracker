using backend.Enums;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<GoogleCredential> GoogleCredentials { get; set; }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.FirstName).HasMaxLength(100);
            entity.Property(u => u.LastName).HasMaxLength(50);

            entity.HasOne(u => u.GoogleCredential)
                .WithOne(l => l.User)
                .HasForeignKey<GoogleCredential>(l => l.UserId);

            entity.HasMany(u => u.Accounts)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId);

            entity.HasMany(u => u.Categories)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId);

            entity.HasMany(u => u.Transactions)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId);
        });

        modelBuilder.Entity<RefreshToken>(b =>
        {
            b.HasIndex(r => r.TokenHash).IsUnique();
            b.HasIndex(r => r.UserId);
        });

        modelBuilder.Entity<GoogleCredential>(entity =>
        {
            entity.HasKey(g => g.UserId);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasIndex(u => u.Subject).IsUnique();
        });

        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.HasMany(a => a.Transactions)
                .WithOne(t => t.Account)
                .HasForeignKey(t => t.AccountId);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.HasMany(c => c.Transactions)
                .WithOne(t => t.Category)
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Transaction>().HasKey(d => d.Id);
    }
}
