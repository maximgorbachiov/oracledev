using TarotService.Data.Models.Attributes;

namespace TarotService.Data.Models.Enums;

public enum Zodiacs
{
    [ZodiacDateRange(3, 21, 4, 19)]
    Aries = 0,
    [ZodiacDateRange(4, 20, 5, 20)]
    Taurus = 1,
    [ZodiacDateRange(5, 21, 6, 20)]
    Twins = 2,
    [ZodiacDateRange(6, 21, 7, 22)]
    Cancer = 3,
    [ZodiacDateRange(7, 23, 8, 22)]
    Lion = 4,
    [ZodiacDateRange(8, 23, 9, 22)]
    Virgo = 5,
    [ZodiacDateRange(9, 23, 10, 22)]
    Libra = 6,
    [ZodiacDateRange(10, 23, 11, 21)]
    Scorpio = 7,
    [ZodiacDateRange(11, 22, 12, 21)]
    Sagittarius = 8,
    [ZodiacDateRange(12, 22, 1, 19)]
    Capricorn = 9,
    [ZodiacDateRange(1, 20, 2, 18)]
    Aquarius = 10,
    [ZodiacDateRange(2, 19, 3, 20)]
    Pisces = 11
}