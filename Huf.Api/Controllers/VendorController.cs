using Microsoft.AspNetCore.Mvc;
using Huf.Models;
using Huf.Services.Interfaces;

namespace Huf.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VendorController : ControllerBase
{
    private readonly ILogger<VendorController> _logger;
    private readonly IVendorService _vendorService;

    public VendorController(ILogger<VendorController> logger,IVendorService vendorService)
    {
        _logger = logger;
        _vendorService = vendorService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var vendors = await _vendorService.GetAllAsync();
        return Ok(vendors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var vendor = await _vendorService.GetByIdAsync(id);
        if (vendor == null) return NotFound();
        return Ok(vendor);
    }

    [HttpPost]
    public async Task<IActionResult> Create(VendorMaster vendor)
    {
        await _vendorService.AddAsync(vendor);
        return CreatedAtAction(nameof(GetById), new { id = vendor.Id }, vendor);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, VendorMaster vendor)
    {
        if (id != vendor.Id) return BadRequest();
        await _vendorService.UpdateAsync(vendor);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _vendorService.DeleteAsync(id);
        return NoContent();
    }
}