using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<LocalCredential> LocalCredentials { get; set; }
    public DbSet<GoogleCredential> GoogleCredentials { get; set; }
    public DbSet<VerifyAccount> VerifyAccounts { get; set; }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<DefaultAccount> DefaultAccounts { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().HasKey(u => u.Id);
        modelBuilder.Entity<User>().Property(u => u.FirstName).HasMaxLength(100);
        modelBuilder.Entity<User>().Property(u => u.LastName).HasMaxLength(50);
        modelBuilder.Entity<User>()
            .HasOne(u => u.LocalCredential)
            .WithOne(l => l.User)
            .HasForeignKey<LocalCredential>(l => l.UserId);
        modelBuilder.Entity<User>()
            .HasOne(u => u.GoogleCredential)
            .WithOne(l => l.User)
            .HasForeignKey<GoogleCredential>(l => l.UserId);
        modelBuilder.Entity<User>()
            .HasMany(u => u.Accounts)
            .WithOne(a => a.Owner)
            .HasForeignKey(a => a.OwnerId);
        modelBuilder.Entity<User>()
            .HasOne(u => u.DefaultAccount)
            .WithOne(d => d.User)
            .HasForeignKey<DefaultAccount>(l => l.UserId);
        modelBuilder.Entity<User>()
            .HasMany(u => u.Transactions)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId);

        modelBuilder.Entity<User>(b =>
        {
            b.HasOne(u => u.RefreshToken).WithOne(r => r.User).HasForeignKey<RefreshToken>(r => r.UserId);
        });

        modelBuilder.Entity<RefreshToken>(b =>
        {
            b.HasKey(r => r.UserId);
            b.HasIndex(r => r.TokenHash).IsUnique();
        });

        modelBuilder.Entity<LocalCredential>().HasKey(u => u.UserId);
        modelBuilder.Entity<LocalCredential>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<LocalCredential>()
            .HasOne(l => l.VerifyAccount)
            .WithOne(v => v.LocalCredential)
            .HasPrincipalKey<LocalCredential>(l => l.Email)
            .HasForeignKey<VerifyAccount>(v => v.Email);

        modelBuilder.Entity<GoogleCredential>().HasKey(u => u.UserId);
        modelBuilder.Entity<GoogleCredential>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<GoogleCredential>().HasIndex(u => u.Subject).IsUnique();

        modelBuilder.Entity<VerifyAccount>().HasKey(v => v.Email);
        modelBuilder.Entity<VerifyAccount>().HasIndex(v => v.Token).IsUnique();

        modelBuilder.Entity<Account>().HasKey(a => a.Id);
        modelBuilder.Entity<Account>()
            .HasOne(u => u.DefaultAccount)
            .WithOne(d => d.Account)
            .HasForeignKey<DefaultAccount>(l => l.UserId);
        modelBuilder.Entity<Account>()
            .HasMany(u => u.Categories)
            .WithOne(d => d.Account)
            .HasForeignKey(l => l.AccountId);
        modelBuilder.Entity<Account>()
            .HasMany(u => u.Transactions)
            .WithOne(d => d.Account)
            .HasForeignKey(l => l.AccountId);

        modelBuilder.Entity<DefaultAccount>().HasKey(d => d.UserId);

        modelBuilder.Entity<Category>().HasKey(d => d.Id);
        modelBuilder.Entity<Category>()
            .HasMany(c => c.Transactions)
            .WithOne(t => t.Category)
            .HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Transaction>().HasKey(d => d.Id);
    }
}
