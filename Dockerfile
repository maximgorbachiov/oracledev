# -------------------------------
# Stage 1: Build
# -------------------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY TarotService/TarotService.sln ./
COPY TarotService/TarotService.Web.API/TarotService.Web.API.csproj TarotService/TarotService.Web.API/
COPY TarotService/TarotService.BusinessLogic/TarotService.BusinessLogic.csproj TarotService/TarotService.BusinessLogic/
COPY TarotService/TarotService.Data/TarotService.Data.csproj TarotService/TarotService.Data/

# Restore dependencies
RUN dotnet restore TarotService/TarotService.Web.API/TarotService.Web.API.csproj

# Copy the rest of the source code
COPY TarotService/ TarotService/

# Build the app (no restore)
RUN dotnet build TarotService/TarotService.Web.API/TarotService.Web.API.csproj -c Release -o /app/build

# -------------------------------
# Stage 2: Publish
# -------------------------------
FROM build AS publish
RUN dotnet publish TarotService/TarotService.Web.API/TarotService.Web.API.csproj -c Release -o /app/publish /p:UseAppHost=false

# -------------------------------
# Stage 3: Runtime
# -------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published output
COPY --from=publish /app/publish .

# Set environment variables (can be overridden by docker-compose)
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port
EXPOSE 8080

# Start the app
ENTRYPOINT ["dotnet", "TarotService.Web.API.dll"]
