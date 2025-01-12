using Microsoft.AspNetCore.Mvc;

namespace Huf.App.Controllers
{
    public class VendorController : Controller
    {
        private readonly ILogger<VendorController> _logger;
        private readonly string _baseUrl;
        private readonly HttpClient _httpClient;

        public VendorController(ILogger<VendorController> logger,IConfiguration configuration, HttpClient httpClient)
        {
            _logger = logger;
            _baseUrl = configuration["ApiSettings:BaseUrl"];
            _httpClient = httpClient;
        }

        public IActionResult Index()
        {
            var username = "Test User";
            ViewBag.Username = username;
            return View();
        }

        public async Task<string> GetVendorAsync()
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/api/Vendor");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
    }
}
