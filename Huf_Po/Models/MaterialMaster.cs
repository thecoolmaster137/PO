using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
namespace Huf.Models
{
    public class MaterialMaster
    {
        [Key]
        public int Id { get; set; }
        public string? Code { get; set; }
        public string? ShortText { get; set; }
        public string? LognText { get; set; }
        public string? Unit { get; set; }
        public string? ReorderLevel { get; set; }
        public string? MinOrderQuantity { get; set; }
        public DateTime? CreatedDate { get; set;}
        public DateTime? UpdatedDate { get; set;}
        public bool? IsActive { get; set; }
    }
}
