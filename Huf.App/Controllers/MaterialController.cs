using Microsoft.AspNetCore.Mvc;

namespace Huf.App.Controllers
{
    public class MaterialController : Controller
    {
        private readonly ILogger<MaterialController> _logger;
        private readonly string _baseUrl;
        private readonly HttpClient _httpClient;

        public MaterialController(ILogger<MaterialController> logger,IConfiguration configuration, HttpClient httpClient)
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

        [HttpGet]
        public async Task<IActionResult> GetAllData()
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/api/Material");
            Console.WriteLine(response);
            response.EnsureSuccessStatusCode();
            var data = await response.Content.ReadAsStringAsync();
            return Json(data);
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] MaterialRequestModel model)
        {
            var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/api/Material", model);
            response.EnsureSuccessStatusCode();
            return Ok("Material inserted successfully.");
        }

        [HttpPost]
        public async Task<IActionResult> Update([FromBody] MaterialRequestModel model)
        {
            var response = await _httpClient.PutAsJsonAsync($"{_baseUrl}/api/Material", model);
            response.EnsureSuccessStatusCode();
            return Ok("Material updated successfully.");
        }

        [HttpPost]
        public async Task<IActionResult> Delete([FromBody] List<Guid> ids)
        {
            var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/api/Material/Delete", ids);
            response.EnsureSuccessStatusCode();
            return Ok("Material deleted successfully.");
        }
    }

    public class MaterialRequestModel
    {
        public Guid GUID { get; set; }
        public string MaterialCode { get; set; }
        public string Material { get; set; }
        public bool IsActive { get; set; }
    }
}
