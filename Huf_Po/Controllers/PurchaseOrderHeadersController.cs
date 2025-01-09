using Microsoft.AspNetCore.Mvc;
using Huf.Models;
using Huf.Services.Interfaces;

namespace Huf.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PurchaseOrderHeadersController : ControllerBase
{
    private readonly IPurchaseOrderHeaderService _service;

    public PurchaseOrderHeadersController(IPurchaseOrderHeaderService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var headers = await _service.GetAllAsync();
        return Ok(headers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var header = await _service.GetByIdAsync(id);
        if (header == null)
        {
            return NotFound();
        }
        return Ok(header);
    }

    [HttpPost]
    public async Task<IActionResult> Create(PurchaseOrderHeader purchaseOrderHeader)
    {
        await _service.AddAsync(purchaseOrderHeader);
        return CreatedAtAction(nameof(GetById), new { id = purchaseOrderHeader.Id }, purchaseOrderHeader);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, PurchaseOrderHeader purchaseOrderHeader)
    {
        if (id != purchaseOrderHeader.Id)
        {
            return BadRequest();
        }
        await _service.UpdateAsync(purchaseOrderHeader);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}

