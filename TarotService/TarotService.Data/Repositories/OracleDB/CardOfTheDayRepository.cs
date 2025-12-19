using TarotService.Data.Interfaces;
using TarotService.Data.Models;

namespace TarotService.Data.Repositories.OracleDB;

public class CardOfTheDayRepository : ICardOfTheDayRepository
{
    public CardOfTheDay GetCardOfTheDay(int id)
    {
        return new CardOfTheDay { Name = "Default name", Description = "Today you will be very happy" };
    }
}