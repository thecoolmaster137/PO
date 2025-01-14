using Microsoft.AspNetCore.Mvc;
using Huf.Models;
using Huf.Services.Interfaces;

namespace Huf.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaterialController : ControllerBase
{
    private readonly ILogger<MaterialController> _logger;
    private readonly IMaterialService _materialService;

    public MaterialController(ILogger<MaterialController> logger,IMaterialService materialService)
    {
        _logger = logger;
        _materialService = materialService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var materials = await _materialService.GetAllAsync();
        return Ok(materials);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var material = await _materialService.GetByIdAsync(id);
        if (material == null) return NotFound();
        return Ok(material);
    }

    [HttpPost]
    public async Task<IActionResult> Create(MaterialMaster material)
    {
        Console.WriteLine("Create Req: ");
        Console.WriteLine(material);
        await _materialService.AddAsync(material);
        return CreatedAtAction(nameof(GetById), new { id = material.Id }, material);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, MaterialMaster material)
    {
        if (id != material.Id) return BadRequest();
        await _materialService.UpdateAsync(material);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _materialService.DeleteAsync(id);
        return NoContent();
    }
}