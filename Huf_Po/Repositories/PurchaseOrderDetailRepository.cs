using Microsoft.EntityFrameworkCore;
using Huf.Models;
using Huf.Repositories.Interfaces;

namespace Huf.Repositories
{
    public class PurchaseOrderDetailRepository : IPurchaseOrderDetailRepository
    {
        private readonly ApplicationDbContext _context;

        public PurchaseOrderDetailRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PurchaseOrderDetail>> GetAllAsync()
        {
            return await _context.tbl_PurchaseOrderDetails.ToListAsync();
        }

        public async Task<PurchaseOrderDetail> GetByIdAsync(int id)
        {
            return await _context.tbl_PurchaseOrderDetails.FindAsync(id);
        }

        public async Task AddAsync(PurchaseOrderDetail purchaseOrderDetail)
        {
            await _context.tbl_PurchaseOrderDetails.AddAsync(purchaseOrderDetail);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(PurchaseOrderDetail purchaseOrderDetail)
        {
            _context.tbl_PurchaseOrderDetails.Update(purchaseOrderDetail);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var detail = await GetByIdAsync(id);
            if (detail != null)
            {
                _context.tbl_PurchaseOrderDetails.Remove(detail);
                await _context.SaveChangesAsync();
            }
        }
    }
}