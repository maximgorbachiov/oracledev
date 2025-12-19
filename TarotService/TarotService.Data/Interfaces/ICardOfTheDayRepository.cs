using TarotService.Data.Models;

namespace TarotService.Data.Interfaces;

public interface ICardOfTheDayRepository
{
    CardOfTheDay GetCardOfTheDay(int id);
}