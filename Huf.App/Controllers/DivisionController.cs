
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.IO;
namespace Huf.App.Controllers
{
    public class DivisionController : Controller
    {
        private readonly ILogger<DivisionController> _logger;
        // Constructor to inject the service
        public DivisionController(ILogger<DivisionController> logger)
        {
            _logger = logger;
        }
        
        public async Task<IActionResult> Index()
        { 
            var username = "Test User";
            ViewBag.Username = username;
            return View();
        }
        //public async Task<IActionResult> GetAllData()
        //{
        //    try
        //    {
        //        var request = new DivisionGetAllRequestModel { TenantId = UserData.TenantId, ClientGroupId = UserData.ClientGroupId ?? 0 };
        //        var result = await _service.GetAllAsync(request);
        //        return Json(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return View("Error");
        //    }
        //}
        //[HttpPost]
        //public async Task<ActionResult> Delete([FromBody] List<DivisionDeleteRequestModel> deleteRowsData)
        //{
        //    try
        //    {
        //        var lastChangedBy = UserData.UserId ?? 0; // Consider using proper authentication for identifying the user
        //        await _service.ExecuteDeleteStoredProcedureAsync(deleteRowsData, lastChangedBy);
        //        return Ok(new { success = true });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { success = false, error = ex.Message });
        //    }
        //}
        //[HttpPost]
        //public async Task<ActionResult> Insert([FromBody] App_DivisionInsertRequest request)
        //{
        //    try
        //    {
        //        DivisionInsertRequestModel objFinalRequest = new DivisionInsertRequestModel();
        //        //objFinalRequest.DivisionCode = request.DivisionCode;
        //        objFinalRequest.Division = request.Division;
        //        objFinalRequest.TenantId = UserData.TenantId;
        //        objFinalRequest.ClientGroupId = UserData.ClientGroupId ?? 0;
        //        objFinalRequest.IsActive = true;
        //        objFinalRequest.CreatedBy = UserData.UserId ?? 0;
        //        //objFinalRequest.LastChangedBy = UserData.UserId ?? 0;
        //        await _service.ExecuteInsertStoredProcedureAsync(objFinalRequest);
        //        return Ok("Division inserted successfully.");
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal Server Error: {ex.Message}");
        //    }
        //}
        //[HttpPost]
        //public async Task<ActionResult> Update([FromBody] App_DivisionUpdateRequest objData)
        //{
        //    try
        //    {
        //        DivisionUpdateRequestModel request = new DivisionUpdateRequestModel();
        //        request.Guid = objData.GUID;
        //        request.DivisionCode = objData.DivisionCode;
        //        request.Division = objData.Division;
        //        request.IsActive = objData.IsActive;
        //        request.TenantId = UserData.TenantId;
        //        request.ClientGroupId = UserData.ClientGroupId ?? 0;
        //        request.LastChangedBy = UserData.UserId ?? 0;
        //        await _service.ExecuteUpdateStoredProcedureAsync(request);
        //        return Ok("Division updated successfully.");
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal Server Error: {ex.Message}");
        //    }
        //}
    }
}
