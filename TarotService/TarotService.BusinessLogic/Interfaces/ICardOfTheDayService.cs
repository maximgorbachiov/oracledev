using TarotService.BusinessLogic.BusinessModels;

namespace TarotService.BusinessLogic.Interfaces;

public interface ICardOfTheDayService
{
    CardOfTheDayVm GetCardOfTheDay();
}