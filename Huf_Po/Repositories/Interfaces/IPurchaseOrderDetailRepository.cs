using Huf.Models;

namespace Huf.Repositories.Interfaces
{
    public interface IPurchaseOrderDetailRepository
    {
        Task<IEnumerable<PurchaseOrderDetail>> GetAllAsync();
        Task<PurchaseOrderDetail> GetByIdAsync(int id);
        Task AddAsync(PurchaseOrderDetail purchaseOrderDetail);
        Task UpdateAsync(PurchaseOrderDetail purchaseOrderDetail);
        Task DeleteAsync(int id);
    }
}