using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using api.Middleware;
using Microsoft.EntityFrameworkCore;
using Persistence;
using MediatR;
using Application.Activities;
using FluentValidation.AspNetCore;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(options => {
                options.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });

            // setting up cors for our frontend
            services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policy => {
                    policy.AllowAnyHeader().AllowAnyMethod()
                    .WithOrigins("http://localhost:3000");
                });
            });

            // speficifing one class gets the entire assembly
            services.AddMediatR(typeof(List.Handler).Assembly);
            
            services.AddControllers()
                .AddFluentValidation(cfg => 
                {
                    // speficifing one class gets the entire assembly
                    cfg.RegisterValidatorsFromAssemblyContaining<Create>();
                });

            var builder = services.AddIdentityCore<AppUser>();
            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

            services.AddAuthentication();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ErrorHandlingMiddleware>();

            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
