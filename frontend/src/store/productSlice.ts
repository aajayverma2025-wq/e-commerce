import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;          // primary image (first of images[])
  images?: string[];      // all product images
  hidden?: boolean;       // hidden from storefront
  soldCount?: number;
  isBestseller?: boolean;
  vendorId?: string;      // associated vendor ID
}

interface ProductState {
  items: Product[];
}

const INITIAL_DUMMY_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max - 256GB, Titanium',
    category: 'Electronics',
    price: 1199,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 1245,
    stock: 45,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
    discount: 8,
    soldCount: 5400,
    isBestseller: true,
    vendorId: 'V001',
  },
  {
    id: '2',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    category: 'Electronics',
    price: 348,
    originalPrice: 398,
    rating: 4.7,
    reviews: 892,
    stock: 12,
    status: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop',
    discount: 12,
    soldCount: 1200,
    isBestseller: true,
    vendorId: 'V001',
  },
  {
    id: '3',
    name: 'MacBook Air M2 - 13.6" Liquid Retina Display, 8GB RAM',
    category: 'Electronics',
    price: 999,
    originalPrice: 1099,
    rating: 4.9,
    reviews: 2156,
    stock: 25,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    discount: 9,
    soldCount: 850,
    vendorId: 'V003',
  },
  {
    id: '4',
    name: 'Samsung Galaxy Watch 6 Classic, 47mm, Stainless Steel',
    category: 'Electronics',
    price: 329,
    originalPrice: 399,
    rating: 4.5,
    reviews: 654,
    stock: 0,
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop',
    discount: 18,
    soldCount: 420,
    vendorId: 'V002',
  },
];

const initialState: ProductState = {
  items: INITIAL_DUMMY_PRODUCTS,
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Omit<Product, 'id'>>) => {
      const imgs = action.payload.images && action.payload.images.length > 0
        ? action.payload.images
        : action.payload.image ? [action.payload.image] : [];
      const newProduct: Product = {
        ...action.payload,
        id: Date.now().toString(),
        image: imgs[0] || action.payload.image,
        images: imgs,
        soldCount: Math.floor(Math.random() * 500),
        isBestseller: Math.random() > 0.8,
      };
      state.items.push(newProduct);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
    toggleHidden: (state, action: PayloadAction<string>) => {
      const p = state.items.find(p => p.id === action.payload);
      if (p) p.hidden = !p.hidden;
    },
  },
});

export const { addProduct, updateProduct, deleteProduct, toggleHidden } = productSlice.actions;
export default productSlice.reducer;
