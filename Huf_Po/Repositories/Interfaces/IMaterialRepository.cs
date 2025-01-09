using Huf.Models;

namespace Huf.Repositories.Interfaces
{
    public interface IMaterialRepository
    {
        Task<IEnumerable<MaterialMaster>> GetAllAsync();
        Task<MaterialMaster> GetByIdAsync(int id);
        Task AddAsync(MaterialMaster material);
        Task UpdateAsync(MaterialMaster material);
        Task DeleteAsync(int id);
    }
}