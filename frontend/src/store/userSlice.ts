import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  sold?: string | number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: string;
  status: 'Active' | 'Inactive';
}

interface UserState {
  user: {
    name: string;
    email: string;
    phone?: string;
    role: 'customer' | 'vendor' | 'admin';
    vendorId?: string;
  } | null;
  isAuthenticated: boolean;
  wishlist: WishlistItem[];
  customers: Customer[];
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  wishlist: [],
  customers: [
    { id: 'C001', name: 'John Doe', email: 'john@example.com', phone: '+1 555-0101', orders: 12, spent: '$1,245.00', status: 'Active' },
    { id: 'C002', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 555-0102', orders: 5, spent: '$340.00', status: 'Active' },
    { id: 'C003', name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 555-0103', orders: 0, spent: '$0.00', status: 'Inactive' },
  ],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; name: string; phone?: string; role?: 'customer' | 'vendor' | 'admin'; vendorId?: string }>) => {
      state.user = {
        email: action.payload.email,
        name: action.payload.name || action.payload.email.split('@')[0],
        phone: action.payload.phone,
        role: action.payload.role || 'customer',
        vendorId: action.payload.vendorId,
      };
      state.isAuthenticated = true;

      // Ensure backward compatibility with older local storage state structure
      if (!state.customers) {
        state.customers = [
          { id: 'C001', name: 'John Doe', email: 'john@example.com', phone: '+1 555-0101', orders: 12, spent: '$1,245.00', status: 'Active' },
          { id: 'C002', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 555-0102', orders: 5, spent: '$340.00', status: 'Active' },
          { id: 'C003', name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 555-0103', orders: 0, spent: '$0.00', status: 'Inactive' },
        ];
      }

      if (state.user.role === 'customer' && !state.customers.some(c => c.email === action.payload.email)) {
        state.customers.push({
          id: `C${String(state.customers.length + 1).padStart(3, '0')}`,
          name: state.user.name,
          email: state.user.email,
          phone: action.payload.phone || 'Not Provided',
          orders: 0,
          spent: '$0.00',
          status: 'Active',
        });
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const existingIndex = state.wishlist.findIndex(item => item.id === action.payload.id);
      if (existingIndex >= 0) {
        state.wishlist.splice(existingIndex, 1);
      } else {
        state.wishlist.push(action.payload);
      }
    },
  },
});

export const { login, logout, toggleWishlist } = userSlice.actions;
export default userSlice.reducer;
