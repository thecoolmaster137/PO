using Huf.Models;
using Huf.Repositories.Interfaces;
using Huf.Services.Interfaces;

namespace Huf.Services
{
    public class VendorService : IVendorService
    {
        private readonly IVendorRepository _vendorRepository;

        public VendorService(IVendorRepository vendorRepository)
        {
            _vendorRepository = vendorRepository;
        }

        public async Task<IEnumerable<VendorMaster>> GetAllAsync()
        {
            return await _vendorRepository.GetAllAsync();
        }

        public async Task<VendorMaster> GetByIdAsync(int id)
        {
            return await _vendorRepository.GetByIdAsync(id);
        }

        public async Task AddAsync(VendorMaster vendor)
        {
            await _vendorRepository.AddAsync(vendor);
        }

        public async Task UpdateAsync(VendorMaster vendor)
        {
            await _vendorRepository.UpdateAsync(vendor);
        }

        public async Task DeleteAsync(int id)
        {
            await _vendorRepository.DeleteAsync(id);
        }
    }
}