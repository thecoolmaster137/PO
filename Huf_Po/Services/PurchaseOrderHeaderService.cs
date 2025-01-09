using Huf.Models;
using Huf.Repositories.Interfaces;
using Huf.Services.Interfaces;

namespace Huf.Services
{
    public class PurchaseOrderHeaderService : IPurchaseOrderHeaderService
    {
        private readonly IPurchaseOrderHeaderRepository _repository;
    
        public PurchaseOrderHeaderService(IPurchaseOrderHeaderRepository repository)
        {
            _repository = repository;
        }
    
        public Task<IEnumerable<PurchaseOrderHeader>> GetAllAsync() => _repository.GetAllAsync();
    
        public Task<PurchaseOrderHeader> GetByIdAsync(int id) => _repository.GetByIdAsync(id);
    
        public Task AddAsync(PurchaseOrderHeader purchaseOrderHeader) => _repository.AddAsync(purchaseOrderHeader);
    
        public Task UpdateAsync(PurchaseOrderHeader purchaseOrderHeader) => _repository.UpdateAsync(purchaseOrderHeader);
    
        public Task DeleteAsync(int id) => _repository.DeleteAsync(id);
    }
}