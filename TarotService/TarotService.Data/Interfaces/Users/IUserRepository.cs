using TarotService.Data.Models.Users;

namespace TarotService.Data.Interfaces.Users;

public interface IUserRepository
{
    Task<int> CreateUserAsync(User user);
    Task<User?> GetUserAsync(int id);
    Task<List<User>> GetAllUsersAsync();
    Task<bool> UpdateUserAsync(User user);
    Task<bool> RemoveUserAsync(int id);
}