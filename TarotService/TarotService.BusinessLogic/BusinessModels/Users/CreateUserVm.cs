using TarotService.Data.Models.Enums;
using TarotService.Data.Models.Users;

namespace TarotService.BusinessLogic.BusinessModels.Users;

public class CreateUserVm
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public Zodiacs Zodiac { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }

    public User ToUser()
    {
        return new User
        {
            FirstName = FirstName,
            LastName = LastName,
            DateOfBirth = DateOfBirth,
            Email = Email,
            Address = Address,
            PhoneNumber = PhoneNumber
        };
    }
}