using Huf.Models;

namespace Huf.Repositories.Interfaces
{
    public interface IPurchaseOrderHeaderRepository
    {
        Task<IEnumerable<PurchaseOrderHeader>> GetAllAsync();
        Task<PurchaseOrderHeader> GetByIdAsync(int id);
        Task AddAsync(PurchaseOrderHeader purchaseOrderHeader);
        Task UpdateAsync(PurchaseOrderHeader purchaseOrderHeader);
        Task DeleteAsync(int id);
    }
}