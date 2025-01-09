using Huf.Models;

namespace Huf.Services.Interfaces
{
    public interface IPurchaseOrderDetailService
    {
        Task<IEnumerable<PurchaseOrderDetail>> GetAllAsync();
        Task<PurchaseOrderDetail> GetByIdAsync(int id);
        Task AddAsync(PurchaseOrderDetail purchaseOrderDetail);
        Task UpdateAsync(PurchaseOrderDetail purchaseOrderDetail);
        Task DeleteAsync(int id);
    }
}