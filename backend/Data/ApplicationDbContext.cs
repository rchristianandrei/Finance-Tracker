using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<GoogleCredential> GoogleCredentials { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().HasKey(u => u.Id);
        modelBuilder.Entity<User>().Property(u => u.FirstName).HasMaxLength(100);
        modelBuilder.Entity<User>().Property(u => u.LastName).HasMaxLength(50);
        modelBuilder.Entity<User>()
            .HasOne(u => u.GoogleCredential)
            .WithOne(l => l.User)
            .HasForeignKey<GoogleCredential>(l => l.UserId);
        modelBuilder.Entity<User>()
            .HasMany(u => u.Categories)
            .WithOne(c => c.User)
            .HasForeignKey(c => c.UserId);
        modelBuilder.Entity<User>()
            .HasMany(u => u.Transactions)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId);

        modelBuilder.Entity<RefreshToken>(b =>
        {
            b.HasIndex(r => r.TokenHash).IsUnique();
            b.HasIndex(r => r.UserId);
        });

        modelBuilder.Entity<GoogleCredential>().HasKey(u => u.UserId);
        modelBuilder.Entity<GoogleCredential>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<GoogleCredential>().HasIndex(u => u.Subject).IsUnique();

        modelBuilder.Entity<Category>().HasKey(d => d.Id);
        modelBuilder.Entity<Category>()
            .HasMany(c => c.Transactions)
            .WithOne(t => t.Category)
            .HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Transaction>().HasKey(d => d.Id);
    }
}
