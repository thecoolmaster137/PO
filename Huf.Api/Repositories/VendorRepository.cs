using Microsoft.EntityFrameworkCore;
using Huf.Models;
using Huf.Repositories.Interfaces;

namespace Huf.Repositories
{
    public class VendorRepository : IVendorRepository
    {
        private readonly ApplicationDbContext _context;

        public VendorRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<VendorMaster>> GetAllAsync()
        {
            return await _context.tbl_Vendors.ToListAsync();
        }

        public async Task<VendorMaster> GetByIdAsync(int id)
        {
            return await _context.tbl_Vendors.FindAsync(id);
        }

        public async Task AddAsync(VendorMaster vendor)
        {
            await _context.tbl_Vendors.AddAsync(vendor);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(VendorMaster vendor)
        {
            _context.tbl_Vendors.Update(vendor);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var vendor = await _context.tbl_Vendors.FindAsync(id);
            if (vendor != null)
            {
                _context.tbl_Vendors.Remove(vendor);
                await _context.SaveChangesAsync();
            }
        }
    }
}
