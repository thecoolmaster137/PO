using Microsoft.EntityFrameworkCore;
using Huf.Models;
using Huf.Services;
using Huf.Services.Interfaces;
using Huf.Repositories;
using Huf.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Services
builder.Services.AddScoped<IVendorService, VendorService>();
builder.Services.AddScoped<IMaterialService, MaterialService>();
builder.Services.AddScoped<IPurchaseOrderHeaderService, PurchaseOrderHeaderService>();
builder.Services.AddScoped<IPurchaseOrderDetailService, PurchaseOrderDetailService>();

// Repository

builder.Services.AddScoped<IVendorRepository, VendorRepository>();
builder.Services.AddScoped<IMaterialRepository, MaterialRepository>();
builder.Services.AddScoped<IPurchaseOrderHeaderRepository, PurchaseOrderHeaderRepository>();
builder.Services.AddScoped<IPurchaseOrderDetailRepository, PurchaseOrderDetailRepository>();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure MS SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
