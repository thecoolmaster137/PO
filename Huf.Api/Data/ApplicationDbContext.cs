using Microsoft.EntityFrameworkCore;
using Huf.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<VendorMaster> tbl_Vendors { get; set; }
    public DbSet<MaterialMaster> tbl_Materials { get; set; }
    public DbSet<PurchaseOrderHeader> tbl_PurchaseOrderHeaders { get; set; }
    public DbSet<PurchaseOrderDetail> tbl_PurchaseOrderDetails { get; set; }
}
