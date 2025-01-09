using Microsoft.EntityFrameworkCore;
using Huf.Models;
using Huf.Repositories.Interfaces;

namespace Huf.Repositories
{
    public class MaterialRepository : IMaterialRepository
    {
        private readonly ApplicationDbContext _context;

        public MaterialRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MaterialMaster>> GetAllAsync()
        {
            return await _context.tbl_Materials.ToListAsync();
        }

        public async Task<MaterialMaster> GetByIdAsync(int id)
        {
            return await _context.tbl_Materials.FindAsync(id);
        }

        public async Task AddAsync(MaterialMaster material)
        {
            await _context.tbl_Materials.AddAsync(material);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(MaterialMaster material)
        {
            _context.tbl_Materials.Update(material);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var material = await _context.tbl_Materials.FindAsync(id);
            if (material != null)
            {
                _context.tbl_Materials.Remove(material);
                await _context.SaveChangesAsync();
            }
        }
    }
}
