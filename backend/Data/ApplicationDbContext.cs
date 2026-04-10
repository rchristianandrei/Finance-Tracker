using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<LocalCredential> LocalCredentials { get; set; }
    public DbSet<GoogleCredential> GoogleCredentials { get; set; }

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

        modelBuilder.Entity<GoogleCredential>().HasKey(u => u.UserId);
        modelBuilder.Entity<GoogleCredential>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<GoogleCredential>().HasIndex(u => u.Subject).IsUnique();
    }
}
