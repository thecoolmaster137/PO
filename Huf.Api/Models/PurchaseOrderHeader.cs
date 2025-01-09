using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
namespace Huf.Models
{
    public class PurchaseOrderHeader
    {
        [Key]
        public int Id { get; set; } // Primary Key
        public string? OrderNumber { get; set; }
        public DateTime? OrderDate { get; set; }
        public int? VendorId { get; set; }
        public string? Notes { get; set; }
        public decimal? OrderValue { get; set; }
        public string? OrderStatus { get; set; }
        public DateTime? CreatedDateDate { get; set; }
        public DateTime? UpdatedDate { get; set;}
        
        public ICollection<PurchaseOrderDetail>? PurchaseOrderDetails { get; set; }
    }
}