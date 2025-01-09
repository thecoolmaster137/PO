using Microsoft.AspNetCore.Mvc;
using Huf.Models;
using Huf.Services.Interfaces;

namespace Huf.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PurchaseOrderDetailsController : ControllerBase
{
    private readonly IPurchaseOrderDetailService _service;

    public PurchaseOrderDetailsController(IPurchaseOrderDetailService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var details = await _service.GetAllAsync();
        return Ok(details);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var detail = await _service.GetByIdAsync(id);
        if (detail == null)
        {
            return NotFound();
        }
        return Ok(detail);
    }

    [HttpPost]
    public async Task<IActionResult> Create(PurchaseOrderDetail purchaseOrderDetail)
    {
        await _service.AddAsync(purchaseOrderDetail);
        return CreatedAtAction(nameof(GetById), new { id = purchaseOrderDetail.Id }, purchaseOrderDetail);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, PurchaseOrderDetail purchaseOrderDetail)
    {
        if (id != purchaseOrderDetail.Id)
        {
            return BadRequest();
        }
        await _service.UpdateAsync(purchaseOrderDetail);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
