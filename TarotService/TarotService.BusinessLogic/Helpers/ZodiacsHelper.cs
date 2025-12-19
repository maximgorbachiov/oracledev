using TarotService.Data.Models.Attributes;
using TarotService.Data.Models.Enums;

namespace TarotService.BusinessLogic.Helpers;

public static class ZodiacsHelper
{
    private static readonly List<Zodiacs> _zodiacs = new List<Zodiacs>
    {
        Zodiacs.Aries, Zodiacs.Taurus, Zodiacs.Twins, Zodiacs.Cancer, Zodiacs.Lion, Zodiacs.Virgo,
        Zodiacs.Libra, Zodiacs.Scorpio, Zodiacs.Sagittarius, Zodiacs.Capricorn, Zodiacs.Aquarius, Zodiacs.Pisces
    };
    
    public static bool TryFindZodiac(DateTime dateOfBirth, out Zodiacs zodiac)
    {
        var zodiacType = typeof(Zodiacs);
        
        foreach (var z in  _zodiacs)
        {
            var memberInfos = zodiacType.GetMember(z.ToString());
            var enumValueMemberInfo = memberInfos
                .FirstOrDefault(m => m.DeclaringType == zodiacType);
            var valueAttributes = enumValueMemberInfo
                .GetCustomAttributes(typeof(ZodiacDateRangeAttribute), false);
            bool isZodiac = ((ZodiacDateRangeAttribute)valueAttributes[0]).IsInRange(dateOfBirth);

            if (isZodiac)
            {
                zodiac = z;
                return true;
            }
        }

        zodiac = Zodiacs.Aries;
        return false;
    }
}