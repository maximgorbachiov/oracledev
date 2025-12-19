using TarotService.Data.Interfaces;
using TarotService.Data.Models;

namespace TarotService.Data.Repositories.InMemory;

public class TestCardOfTheDayRepository : ICardOfTheDayRepository
{
    private readonly Dictionary<int, CardOfTheDay> _cardsOfTheDay = new();

    public TestCardOfTheDayRepository()
    {
        for (int i = 1; i < 79; i++)
        {
            _cardsOfTheDay.Add(i, new CardOfTheDay
            {
                Id = i,
                Name = $"Card Of The Day {i}",
                Description = $"Your lucky day {i}",
            });
        }
    }

    public CardOfTheDay GetCardOfTheDay(int id)
    {
        if (_cardsOfTheDay.TryGetValue(id, out var cardOfTheDay)) return cardOfTheDay;
        
        throw new KeyNotFoundException();
    }
}