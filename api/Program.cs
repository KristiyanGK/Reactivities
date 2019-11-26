using System;
using Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var serivces = scope.ServiceProvider;

                try 
                {
                    var context = serivces.GetRequiredService<DataContext>();
                    context.Database.Migrate();

                    var userManager = serivces.GetRequiredService<UserManager<AppUser>>();
                    Seed.SeedData(context, userManager).Wait();
                }
                catch(Exception ex) 
                {
                    var logger = serivces.GetRequiredService<ILogger<Program>>();

                    logger.LogError(ex, "An error occured while migrating.");
                }
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
