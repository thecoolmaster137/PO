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
            // Configure HttpClient with a custom handler to bypass SSL validation (for development/testing only)
            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, certificate, chain, sslPolicyErrors) =>
                {
                    // Allow all certificates (unsafe for production)
                    return true;
                }
            };

            _httpClient = new HttpClient(handler);
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
            response.EnsureSuccessStatusCode();
            var data = await response.Content.ReadAsStringAsync();
            Console.WriteLine(data);
            return Json(data);
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] MaterialRequestModel model)
        {
            Console.WriteLine("Insert Model");

            if (model == null)
            {
                return BadRequest("Model cannot be null.");
            }

            // Ensure required fields are provided
            if (string.IsNullOrEmpty(model.Code) || string.IsNullOrEmpty(model.ShortText))
            {
                return BadRequest("Code and ShortText are required fields.");
            }

            model.CreatedDate = DateTime.UtcNow; // Set creation date
            model.UpdatedDate = DateTime.UtcNow; // Set initial updated date

            _logger.LogDebug("Sending payload for insert: {@model}", model);

            HttpResponseMessage response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/api/Material", model);

            if (!response.IsSuccessStatusCode)
            {
                string errorDetails = await response.Content.ReadAsStringAsync();
                _logger.LogError("Insert API Error: {ErrorDetails}", errorDetails);
                return BadRequest($"API Error: {errorDetails}");
            }

            return Ok("Material inserted successfully.");

            // var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/api/Material", model);
            // response.EnsureSuccessStatusCode();
            // return Ok("Material inserted successfully.");
        }

        [HttpPost]
        public async Task<IActionResult> Update([FromBody] MaterialRequestModel model)
        {
            Console.WriteLine("Update Model");
            Console.WriteLine(model);
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
        public int Id { get; set; }
        public string Code { get; set; }
        public string ShortText { get; set; }
        public string LognText { get; set; }
        public string Unit { get; set; }
        public string ReorderLevel { get; set; }
        public string MinOrderQuantity { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsActive { get; set; } 
    }
}