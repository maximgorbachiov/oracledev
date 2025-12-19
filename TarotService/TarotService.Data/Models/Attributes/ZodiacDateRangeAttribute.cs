using TarotService.Data.Models.Enums;

namespace TarotService.Data.Models.Attributes;

public class ZodiacDateRangeAttribute : Attribute
{
    private readonly int _startMonth;
    private readonly int _startDay;
    private readonly int _endMonth;
    private readonly int _endDay;
    
    /// <summary>
    /// Build attribute for zodiac dates ranging.
    /// Start and end dates should be at least really possible.
    /// No check for leap year, supposed that zodiacs do not start on 29 of February 
    /// </summary>
    /// <param name="startMonth"></param>
    /// <param name="startDay"></param>
    /// <param name="endMonth"></param>
    /// <param name="endDay"></param>
    /// <exception cref="ArgumentException"></exception>
    public ZodiacDateRangeAttribute(int startMonth, int startDay, int endMonth, int endDay)
    {
        if (startMonth < 1 || startMonth > 12) throw new ArgumentException(nameof(startMonth));
        if (endMonth < 1 || endMonth > 12) throw new ArgumentException(nameof(endMonth));

        int startMonthAllDays = DateTime.DaysInMonth(1, startMonth);
        if (startDay < 1 || startDay > startMonthAllDays) throw new ArgumentException(nameof(startDay));
        
        int endMonthAllDays = DateTime.DaysInMonth(1, endMonth);
        if (endDay < 1 || endDay > endMonthAllDays) throw new ArgumentException(nameof(endDay));
        
        _startMonth = startMonth;
        _startDay = startDay;
        _endMonth = endMonth;
        _endDay = endDay;
    }

    public bool IsInRange(DateTime date)
    {
        return date.Month >= _startMonth
               && date.Month <= _endMonth
               && date.Day >= _startDay
               && date.Day <= _endDay;
    }
}