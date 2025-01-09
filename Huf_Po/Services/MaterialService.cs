using Huf.Models;
using Huf.Repositories.Interfaces;
using Huf.Services.Interfaces;

namespace Huf.Services
{
    public class MaterialService : IMaterialService
    {
        private readonly IMaterialRepository _materialRepository;

        public MaterialService(IMaterialRepository materialRepository)
        {
            _materialRepository = materialRepository;
        }

        public async Task<IEnumerable<MaterialMaster>> GetAllAsync()
        {
            return await _materialRepository.GetAllAsync();
        }

        public async Task<MaterialMaster> GetByIdAsync(int id)
        {
            return await _materialRepository.GetByIdAsync(id);
        }

        public async Task AddAsync(MaterialMaster material)
        {
            await _materialRepository.AddAsync(material);
        }

        public async Task UpdateAsync(MaterialMaster material)
        {
            await _materialRepository.UpdateAsync(material);
        }

        public async Task DeleteAsync(int id)
        {
            await _materialRepository.DeleteAsync(id);
        }
    }
}