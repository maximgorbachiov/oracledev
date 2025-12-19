using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using TarotService.BusinessLogic.BusinessModels.Users;
using TarotService.BusinessLogic.Helpers;
using TarotService.BusinessLogic.Interfaces;
using TarotService.BusinessLogic.Services;
using TarotService.Data.Interfaces;
using TarotService.Data.Interfaces.Users;
using TarotService.Data.Models;
using TarotService.Data.Models.Enums;
using TarotService.Data.Models.Users;
using TarotService.Data.Repositories.InMemory;
using TarotService.Data.Repositories.OracleDB;
using TarotService.Data.Repositories.PostgresDB.Users;

var builder = WebApplication.CreateBuilder(args);

var env = builder.Environment.EnvironmentName;
var config = builder.Configuration;

// Example: register DB context or other services differently
if (builder.Environment.IsDevelopment())
{
    Console.WriteLine("🧩 Running in Development (Docker Compose)");
    builder.Services.AddScoped<ICardOfTheDayRepository, TestCardOfTheDayRepository>();
    
    var connectionString = builder.Configuration.GetConnectionString("Default");
    builder.Services.AddDbContext<TarotDbContext>(options => options.UseNpgsql(connectionString));

    builder.Services.AddScoped<IUserRepository, PostgresUserRepository>();
}
else
{
    Console.WriteLine("🚀 Running in Production (OCI)");
    builder.Services.AddScoped<ICardOfTheDayRepository, CardOfTheDayRepository>();
}

builder.Services.AddTransient<ICardOfTheDayService, CardOfTheDayService>();

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.MapGet("/", () => "Hello Iryna, I love you so much!!!, and what about you???");
app.MapGet("/cardOfTheDay", (ICardOfTheDayService cardOfTheDayService) =>
{
    return Results.Ok(cardOfTheDayService.GetCardOfTheDay());
});
app.MapGet("/users", async (IUserRepository userRepository) =>
{
    var allUsers = await userRepository.GetAllUsersAsync();
    return Results.Ok(allUsers);
});
app.MapGet("/users/{id}", async (int id, IUserRepository userRepository) =>
{
    var user = await userRepository.GetUserAsync(id);
    return Results.Ok(user);
});
app.MapPost("/users", async (CreateUserVm userVm, IUserRepository userRepository) =>
{
    var entity = userVm.ToUser();

    if (!ZodiacsHelper.TryFindZodiac(entity.DateOfBirth, out Zodiacs zodiac))
    {
        return Results.BadRequest();
    }
    
    entity.Zodiac = zodiac;
    
    var id = await userRepository.CreateUserAsync(entity);
    
    return Results.Ok(id);
});

app.Run();