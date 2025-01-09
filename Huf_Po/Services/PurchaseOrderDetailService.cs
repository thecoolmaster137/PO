using Huf.Models;
using Huf.Repositories.Interfaces;
using Huf.Services.Interfaces;

namespace Huf.Services
{
    public class PurchaseOrderDetailService : IPurchaseOrderDetailService
    {
        private readonly IPurchaseOrderDetailRepository _repository;
    
        public PurchaseOrderDetailService(IPurchaseOrderDetailRepository repository)
        {
            _repository = repository;
        }
    
        public Task<IEnumerable<PurchaseOrderDetail>> GetAllAsync() => _repository.GetAllAsync();
    
        public Task<PurchaseOrderDetail> GetByIdAsync(int id) => _repository.GetByIdAsync(id);
    
        public Task AddAsync(PurchaseOrderDetail purchaseOrderDetail) => _repository.AddAsync(purchaseOrderDetail);
    
        public Task UpdateAsync(PurchaseOrderDetail purchaseOrderDetail) => _repository.UpdateAsync(purchaseOrderDetail);
    
        public Task DeleteAsync(int id) => _repository.DeleteAsync(id);
    }
}