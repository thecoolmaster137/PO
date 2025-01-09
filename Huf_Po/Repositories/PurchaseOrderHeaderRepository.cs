using Microsoft.EntityFrameworkCore;
using Huf.Models;
using Huf.Repositories.Interfaces;

namespace Huf.Repositories
{
    public class PurchaseOrderHeaderRepository : IPurchaseOrderHeaderRepository
    {
        private readonly ApplicationDbContext _context;

        public PurchaseOrderHeaderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PurchaseOrderHeader>> GetAllAsync()
        {
            return await _context.tbl_PurchaseOrderHeaders.Include(h => h.PurchaseOrderDetails).ToListAsync();
        }

        public async Task<PurchaseOrderHeader> GetByIdAsync(int id)
        {
            return await _context.tbl_PurchaseOrderHeaders.Include(h => h.PurchaseOrderDetails)
                .FirstOrDefaultAsync(h => h.Id == id);
        }

        public async Task AddAsync(PurchaseOrderHeader purchaseOrderHeader)
        {
            await _context.tbl_PurchaseOrderHeaders.AddAsync(purchaseOrderHeader);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(PurchaseOrderHeader purchaseOrderHeader)
        {
            _context.tbl_PurchaseOrderHeaders.Update(purchaseOrderHeader);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var header = await GetByIdAsync(id);
            if (header != null)
            {
                _context.tbl_PurchaseOrderHeaders.Remove(header);
                await _context.SaveChangesAsync();
            }
        }
    }
}