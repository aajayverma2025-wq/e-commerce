"use client";

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Truck, ShieldCheck, Heart, ShoppingCart, ArrowLeft, Share2, ChevronRight, Store } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/cartSlice';
import { toggleWishlist } from '@/store/userSlice';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const products = useAppSelector(state => state.products.items);
  const { wishlist = [] } = useAppSelector((state) => state.user);
  const { vendors = [] } = useAppSelector((state) => state.vendors);
  const dispatch = useAppDispatch();

  const product = products.find(p => p.id === productId);
  const vendor = product ? vendors.find(v => v.id === product.vendorId) : null;

  // Gallery state
  const allImages = (product?.images && product.images.length > 0)
    ? product.images
    : product ? [product.image] : [];
  const [activeImg, setActiveImg] = useState(0);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-3xl font-black text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors">
          Back to Shopping
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.some(w => w.id === product.id);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumbs / Top Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex gap-3">
          <button className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="md:max-w-6xl md:mx-auto md:grid md:grid-cols-2 md:gap-12 md:py-8">
        
        {/* Product Image Gallery */}
        <div className="flex flex-col gap-3 md:rounded-2xl overflow-hidden">
          {/* Main Image */}
          <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center md:rounded-2xl overflow-hidden">
            <Image
              src={allImages[activeImg] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800'}
              alt={product.name}
              fill
              className="object-contain p-8 transition-all duration-300"
              priority
            />
            {product.discount && product.discount > 0 ? (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                -{product.discount}% OFF
              </div>
            ) : null}
            {product.isBestseller && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                BESTSELLER
              </div>
            )}
            {/* Image counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {activeImg + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Thumbnails Strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto px-4 md:px-0 pb-1" style={{ scrollbarWidth: 'none' }}>
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImg === idx
                      ? 'border-orange-500 scale-105 shadow-md'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="relative w-full h-full bg-gray-50">
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-contain p-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="px-4 py-6 md:px-0">
          <div className="mb-2">
            <Link href={`/category/${product.category.toLowerCase()}`} className="text-sm font-bold text-orange-500 uppercase tracking-wide hover:underline">
              {product.category}
            </Link>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < Math.floor(product.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"} 
                />
              ))}
              <span className="text-sm font-bold text-gray-900 ml-1">{product.rating}</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span className="text-sm text-gray-500 underline">{product.reviews} Reviews</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span className="text-sm text-gray-500">{product.soldCount || 0}+ sold</span>
          </div>

          <div className="flex items-end gap-3 mb-8">
            <span className="text-4xl font-black text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xl text-gray-400 line-through mb-1">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          {vendor && (
            <div className="mb-6 p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center overflow-hidden flex-shrink-0">
                  {vendor.storeConfig?.logo ? (
                    <img src={vendor.storeConfig.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Store className="text-orange-500" size={20} />
                  )}
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Sold By</span>
                  <span className="font-bold text-gray-800 text-sm leading-tight">{vendor.businessName}</span>
                </div>
              </div>
              <Link href={`/shop/${vendor.id}`}>
                <span className="text-xs font-bold text-orange-500 hover:text-orange-600 hover:underline cursor-pointer">
                  Visit Storefront &gt;
                </span>
              </Link>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            <button 
              onClick={() => dispatch(addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
              }))}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg shadow-sm transition-transform active:scale-95 ${
                product.stock === 0 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              <ShoppingCart size={22} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button 
              onClick={() => dispatch(toggleWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                sold: product.soldCount
              }))}
              className="w-16 flex items-center justify-center bg-orange-50 text-orange-500 rounded-xl hover:bg-orange-100 transition-colors active:scale-95"
            >
              <Heart size={24} className={isWishlisted ? "fill-orange-500" : ""} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Truck size={24} className="text-orange-500" />
              <div>
                <div className="text-sm font-bold text-gray-900">Free Delivery</div>
                <div className="text-xs text-gray-500">Orders over $50</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <ShieldCheck size={24} className="text-green-500" />
              <div>
                <div className="text-sm font-bold text-gray-900">1 Year Warranty</div>
                <div className="text-xs text-gray-500">100% Authentic</div>
              </div>
            </div>
          </div>

          {/* Accordion Info */}
          <div className="border-t border-gray-100 divide-y divide-gray-100">
            <button className="w-full flex items-center justify-between py-4 text-left group">
              <span className="font-bold text-gray-900 group-hover:text-orange-500 transition-colors">Product Description</span>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between py-4 text-left group">
              <span className="font-bold text-gray-900 group-hover:text-orange-500 transition-colors">Shipping & Returns</span>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between py-4 text-left group">
              <span className="font-bold text-gray-900 group-hover:text-orange-500 transition-colors">Customer Reviews ({product.reviews})</span>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
