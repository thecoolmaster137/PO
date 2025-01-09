using Microsoft.AspNetCore.Mvc;

namespace Huf.App.Controllers
{
    public class VendorController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
