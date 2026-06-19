"use client";

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/cartSlice';
import { toggleWishlist } from '@/store/userSlice';
import { ShoppingCart, Heart, Flame, ArrowLeft, SlidersHorizontal, LayoutGrid } from 'lucide-react';

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const rawCategory = resolvedParams.category || '';
  const category = decodeURIComponent(rawCategory).trim();
  const title = category.charAt(0).toUpperCase() + category.slice(1);

  const allProducts = useAppSelector(state => state.products.items).filter(p => !p.hidden);
  const { wishlist = [] } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  // Smart match: handles singular/plural and case differences
  // e.g. 'Electronic' matches 'Electronics', 'Dress' matches 'Dresses'
  const matchCategory = (productCat: string, filterCat: string) => {
    const a = productCat.trim().toLowerCase();
    const b = filterCat.trim().toLowerCase();
    return (
      a === b ||
      a === b + 's' ||
      a + 's' === b ||
      a === b + 'es' ||
      a + 'es' === b ||
      a.startsWith(b) ||
      b.startsWith(a)
    );
  };

  // Filter products
  const products = allProducts.filter(p => matchCategory(p.category, category));

  const [sortBy, setSortBy] = useState('default');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  // Sort logic
  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'bestseller') return (b.soldCount || 0) - (a.soldCount || 0);
    if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/" className="flex items-center gap-1 hover:text-orange-500 transition-colors">
              <ArrowLeft size={14} /> Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{title}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900">{title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                <span className="text-orange-500 font-bold">{products.length}</span> products found
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="bestseller">Best Sellers</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        {!isMounted ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 bg-white rounded-2xl border border-gray-100">
            <LayoutGrid size={52} className="mb-4 opacity-20" />
            <p className="font-semibold text-lg text-gray-600">No products in "{title}" yet</p>
            <p className="text-sm mt-1 mb-4">Add products from Admin → Products with category set to <span className="font-bold text-orange-500">"{title}"</span></p>
            <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-bold transition-colors">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
            {sorted.map((product) => (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                className="bg-white rounded-xl overflow-hidden relative flex flex-col group cursor-pointer shadow-sm hover:shadow-md transition-shadow border border-gray-50"
              >
                <div className="relative aspect-square w-full bg-gray-50 p-3">
                  <Image
                    src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800'}
                    alt={product.name}
                    fill
                    className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 p-2"
                  />
                  {product.isBestseller && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
                      Bestseller
                    </div>
                  )}
                  {product.discount && product.discount > 0 ? (
                    <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
                      -{product.discount}%
                    </div>
                  ) : null}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dispatch(toggleWishlist({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        sold: product.soldCount
                      }));
                    }}
                    className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                  >
                    <Heart
                      size={16}
                      className={wishlist.some(w => w.id === product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                    />
                  </button>
                </div>

                <div className="p-3 flex flex-col flex-grow relative">
                  <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight mb-1">
                    {product.name}
                  </h3>
                  {product.soldCount && product.soldCount > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                      <Flame size={10} className="text-orange-500 fill-orange-500" />
                      {product.soldCount}+ sold
                    </div>
                  )}
                  <div className="mt-auto flex items-end gap-1">
                    <span className="text-sm md:text-base font-black text-black">${product.price.toFixed(2)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[10px] text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dispatch(addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image
                      }));
                    }}
                    className="absolute bottom-3 right-3 w-7 h-7 md:w-9 md:h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors shadow-md z-20"
                  >
                    <ShoppingCart size={13} />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
