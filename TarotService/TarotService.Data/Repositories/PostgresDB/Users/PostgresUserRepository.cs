using Microsoft.EntityFrameworkCore;
using TarotService.Data.Interfaces.Users;
using TarotService.Data.Models;
using TarotService.Data.Models.Users;

namespace TarotService.Data.Repositories.PostgresDB.Users;

public class PostgresUserRepository : IUserRepository
{
    private readonly TarotDbContext _context;

    public PostgresUserRepository(TarotDbContext context)
    {
        _context = context;
    }
    
    public async Task<int> CreateUserAsync(User user)
    {
        var createdUser = await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return createdUser.Entity.Id;
    }

    public async Task<User?> GetUserAsync(int id)
    {
        return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
    }
    
    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _context.Users.AsNoTracking().ToListAsync();
    }

    public async Task<bool> UpdateUserAsync(User user)
    {
        var trackedUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == user.Id);
        
        if (trackedUser == null) return false;
        
        trackedUser.FirstName = user.FirstName;
        trackedUser.LastName = user.LastName;
        trackedUser.DateOfBirth = user.DateOfBirth;
        trackedUser.Zodiac = user.Zodiac;
        trackedUser.Email = user.Email;
        trackedUser.PhoneNumber = user.PhoneNumber;
        trackedUser.Address = user.Address;
        
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task<bool> RemoveUserAsync(int id)
    {
        var trackedUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        
        if (trackedUser == null) return false;
        
        var removedUser = _context.Users.Remove(trackedUser);
        
        await _context.SaveChangesAsync();
        
        if (removedUser.Entity == null) return true;
        
        return false;
    }
}