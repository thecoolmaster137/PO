using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Huf.Models
{
    public class VendorMaster
    {
        [Key]
        public int Id { get; set; }
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContcatNo { get; set; }
        public DateTime? ValidTillDate { get; set; }
        public DateTime? CreatedDate { get; set;}
        public DateTime? UpdatedDate { get; set;}
        public bool? IsActive { get; set; }
    }
}
