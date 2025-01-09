using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
namespace Huf.Models
{
    public class PurchaseOrderDetail
    {
        [Key]
        public int Id { get; set; } // Primary Key
        public int? OrderId { get; set; } // Foreign Key
        public int? MaterialId { get; set; }
        public int? ItemQuantity { get; set; }
        public decimal? ItemRate { get; set; }
        public decimal? ItemValue { get; set; }
        public string? ItemNotes { get; set; }
        public DateTime? ExpectedDate { get; set; }
        public DateTime? CreatedDateDate { get; set; }
        public DateTime? UpdatedDate { get; set;}
        
        public PurchaseOrderHeader? PurchaseOrderHeader { get; set; }
    }
}