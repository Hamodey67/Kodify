import React from 'react';
import { Camera, Edit, Trash2 } from 'lucide-react';

const DUMMY_PRODUCTS = [
  { id: 1, name: 'Premium Wireless Headphones Noise Cancelling', sku: 'SKU-001', price: 150000, stock: 12, color: '#2563eb', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 2, name: 'Mechanical Keyboard RGB Brown Switches', sku: 'SKU-002', price: 85000, stock: 3, color: '#0891b2', image: null },
  { id: 3, name: 'Ergonomic Office Chair Mesh Back', sku: 'SKU-003', price: 210000, stock: 0, color: '#dc2626', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 4, name: 'USB-C to HDMI Adapter 4K 60Hz', sku: 'SKU-004', price: 25000, stock: 24, color: '#059669', image: null },
];

const ProductCardsGrid = () => {
  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-md border border-[#cfd8e6] bg-[#fbfcfe] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#18212f]">
          <span className="h-2 w-2 rounded-sm bg-[#2563eb]" />
          GENERAL
        </div>
        <div className="rounded-md border border-[#cfd8e6] bg-[#fbfcfe] px-3 py-1.5 text-[11px] font-bold text-[#64748b]">
          {DUMMY_PRODUCTS.length} Products
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
        {DUMMY_PRODUCTS.map((product) => {
          const isOutOfStock = product.stock <= 0;
          const isLowStock = !isOutOfStock && product.stock <= 5;

          return (
            <div
              key={product.id}
              className={`group relative flex flex-col overflow-hidden rounded-lg border bg-[#fbfcfe] transition-all duration-150 ${
                isOutOfStock
                  ? 'border-[#e3e9f1] opacity-55'
                  : 'border-[#cfd8e6] hover:border-[#2563eb] hover:shadow-[0_10px_24px_rgba(16,24,40,0.12)]'
              }`}
            >
              <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: product.color || '#2563eb' }} />

              <div className="absolute top-2.5 end-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" className="flex h-7 w-7 items-center justify-center rounded-md border border-[#cfd8e6] bg-[#fbfcfe] text-[#64748b] shadow-sm hover:border-[#2563eb] hover:bg-[#eff6ff] hover:text-[#2563eb]">
                  <Edit size={13} />
                </button>
                <button type="button" className="flex h-7 w-7 items-center justify-center rounded-md border border-[#cfd8e6] bg-[#fbfcfe] text-[#64748b] shadow-sm hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600">
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="flex flex-1 flex-col p-3 pt-2.5">
                {product.image ? (
                  <div className="relative mb-2.5 aspect-[4/3] w-full overflow-hidden rounded-md border border-[#d0d9e4] bg-[#eef2f8]">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                  </div>
                ) : (
                  <div className="relative mb-2.5 aspect-[4/3] w-full overflow-hidden rounded-md border border-[#d0d9e4] bg-[#eef2f8]">
                    <div className="flex h-full flex-col items-center justify-center text-[#94a3b8]">
                      <Camera strokeWidth={1.5} className="mb-1 h-6 w-6 text-[#cbd5e1]" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">No Image</span>
                    </div>
                  </div>
                )}

                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-[10px] font-bold tracking-wide text-[#94a3b8]">{product.sku}</span>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-black ${
                      isOutOfStock ? 'bg-rose-600 text-white' : isLowStock ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {product.stock}
                  </span>
                </div>

                <h3 className="mb-3 min-h-[2.4rem] line-clamp-2 text-[13px] font-extrabold leading-snug text-[#18212f]" title={product.name}>
                  {product.name}
                </h3>

                <div className="mt-auto rounded-md bg-[#0b1a33] px-3 py-2.5">
                  <div className="flex items-end justify-between gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">IQD</span>
                    <span className="font-mono text-base font-black tracking-tight text-white">
                      {product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductCardsGrid;
