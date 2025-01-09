using Huf.Models;

namespace Huf.Services.Interfaces
{
    public interface IMaterialService
    {
        Task<IEnumerable<MaterialMaster>> GetAllAsync();
        Task<MaterialMaster> GetByIdAsync(int id);
        Task AddAsync(MaterialMaster material);
        Task UpdateAsync(MaterialMaster material);
        Task DeleteAsync(int id);
    }
}