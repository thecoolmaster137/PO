using Huf.Models;

namespace Huf.Services.Interfaces
{
    public interface IPurchaseOrderHeaderService
    {
        Task<IEnumerable<PurchaseOrderHeader>> GetAllAsync();
        Task<PurchaseOrderHeader> GetByIdAsync(int id);
        Task AddAsync(PurchaseOrderHeader purchaseOrderHeader);
        Task UpdateAsync(PurchaseOrderHeader purchaseOrderHeader);
        Task DeleteAsync(int id);
    }
}