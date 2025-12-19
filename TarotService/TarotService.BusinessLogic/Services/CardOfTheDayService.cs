using Microsoft.Extensions.Logging;
using TarotService.BusinessLogic.BusinessModels;
using TarotService.BusinessLogic.Interfaces;
using TarotService.Data.Interfaces;

namespace TarotService.BusinessLogic.Services;

public class CardOfTheDayService : ICardOfTheDayService
{
    private readonly ILogger<CardOfTheDayService> _logger;
    private readonly ICardOfTheDayRepository _repository;
    
    private readonly Random _random = new Random();

    public CardOfTheDayService(ILogger<CardOfTheDayService> logger, ICardOfTheDayRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }
    
    public CardOfTheDayVm GetCardOfTheDay()
    {
        int id = _random.Next(1, 79);

        try
        {
            var entity = _repository.GetCardOfTheDay(id);
            var result = new CardOfTheDayVm
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description
            };
            return result;
        }
        catch (KeyNotFoundException e)
        {
            _logger.LogError(e, $"Key not found: {id}");
            throw;
        }
    }
}