using Microsoft.EntityFrameworkCore;
using TarotService.Data.Models.Users;

namespace TarotService.Data.Models;

public class TarotDbContext : DbContext
{
    public TarotDbContext(DbContextOptions<TarotDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FirstName).IsRequired();
            entity.Property(e => e.LastName).IsRequired();
            entity.Property(e => e.DateOfBirth).IsRequired();
            entity.Property(e => e.Zodiac);
            entity.Property(e => e.Email);
            entity.Property(e => e.Address);
            entity.Property(e => e.PhoneNumber);
        });
    }
}