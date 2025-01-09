using Huf.Models;

namespace Huf.Services.Interfaces
{
    public interface IVendorService
    {
        Task<IEnumerable<VendorMaster>> GetAllAsync();
        Task<VendorMaster> GetByIdAsync(int id);
        Task AddAsync(VendorMaster vendor);
        Task UpdateAsync(VendorMaster vendor);
        Task DeleteAsync(int id);
    }
}