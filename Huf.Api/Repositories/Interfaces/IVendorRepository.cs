using Huf.Models;

namespace Huf.Repositories.Interfaces
{
    public interface IVendorRepository
    {
        Task<IEnumerable<VendorMaster>> GetAllAsync();
        Task<VendorMaster> GetByIdAsync(int id);
        Task AddAsync(VendorMaster vendor);
        Task UpdateAsync(VendorMaster vendor);
        Task DeleteAsync(int id);
    }
}