using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.User
{
    public class CurrentUser
    {
        public class Query : IRequest<User> { }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly IJwtGenerator jwtGenerator;
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;

            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator,
                IUserAccessor userAccessor)
            {
                this.userAccessor = userAccessor;
                this.userManager = userManager;
                this.jwtGenerator = jwtGenerator;
            }


            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await userManager.FindByNameAsync(userAccessor.GetCurrentUserName());

                return new User
                {
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    Token = jwtGenerator.CreateToken(user),
                    Image = null
                };
            }
        }
    }
}