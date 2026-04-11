using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<LocalCredential> LocalCredentials { get; set; }
    public DbSet<GoogleCredential> GoogleCredentials { get; set; }
    public DbSet<VerifyAccount> VerifyAccounts { get; set; }

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
    }
}
