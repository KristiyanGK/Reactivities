using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        private IMediator mediator;

        protected IMediator Mediator => mediator ?? (mediator = HttpContext.RequestServices.GetService<IMediator>());
    }
}