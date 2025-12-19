using TarotService.Data.Models.Enums;

namespace TarotService.BusinessLogic.BusinessModels.Users;

public class UserInfoVm
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public Zodiacs Zodiac { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
}