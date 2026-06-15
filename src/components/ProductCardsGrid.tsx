import React from 'react';
import { Camera, Edit, Trash2 } from 'lucide-react';

const DUMMY_PRODUCTS = [
  { id: 1, name: 'Premium Wireless Headphones Noise Cancelling', sku: 'SKU-001', price: 150000, stock: 'available', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 2, name: 'Mechanical Keyboard RGB Brown Switches', sku: 'SKU-002', price: 85000, stock: 'low', image: null },
  { id: 3, name: 'Ergonomic Office Chair Mesh Back', sku: 'SKU-003', price: 210000, stock: 'out', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 4, name: 'USB-C to HDMI Adapter 4K 60Hz', sku: 'SKU-004', price: 25000, stock: 'available', image: null },
  { id: 5, name: '27-inch 4K Monitor IPS Display', sku: 'SKU-005', price: 450000, stock: 'available', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 6, name: 'Wireless Ergonomic Mouse', sku: 'SKU-006', price: 40000, stock: 'low', image: null },
];

const ProductCardsGrid = () => {
  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
          GENERAL
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700/50">
          {DUMMY_PRODUCTS.length} Products
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {DUMMY_PRODUCTS.map((product) => (
          <div 
            key={product.id} 
            className="group flex flex-col bg-white dark:bg-card border border-slate-200 dark:border-border rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm hover:shadow-md"
          >
            {/* Image Placeholder */}
            <div className="w-full aspect-square bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-3 relative">
              {product.image ? (
                <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                </div>
              ) : (
                <div className="w-full h-full rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-800/30 text-slate-400 transition-all duration-300 group-hover:border-slate-300 dark:group-hover:border-slate-600 group-hover:bg-white dark:group-hover:bg-slate-800/60 shadow-sm">
                  <Camera strokeWidth={1.5} className="w-8 h-8 text-slate-300 dark:text-slate-500 mb-1.5 group-hover:text-slate-400 dark:group-hover:text-slate-400 transition-colors duration-300" />
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">No Image</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 pt-3 flex flex-col flex-grow">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[13px] truncate" title={product.name}>
                  {product.name}
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-muted-foreground mb-3 font-mono tracking-wide">{product.sku}</span>
              
              <div className="flex justify-between items-end mt-auto mb-4">
                <span className="font-black text-emerald-600 dark:text-emerald-500 text-sm">
                  {product.price.toLocaleString()} <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-500/70">IQD</span>
                </span>
                
                {product.stock === 'available' && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase border border-emerald-500/20">
                    Available
                  </span>
                )}
                {product.stock === 'low' && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 uppercase border border-amber-500/20">
                    Low Stock
                  </span>
                )}
                {product.stock === 'out' && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 uppercase border border-rose-500/20">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100 dark:bg-border w-full mb-3" />

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg">
                  <Edit size={14} strokeWidth={2.5} />
                  Edit
                </button>
                <div className="w-px h-5 bg-slate-200 dark:bg-border mx-2" />
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors py-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg">
                  <Trash2 size={14} strokeWidth={2.5} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductCardsGrid;
