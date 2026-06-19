import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  sold: string;
}

interface UserState {
  user: {
    name: string;
    email: string;
    role: 'customer' | 'vendor' | 'admin';
  } | null;
  isAuthenticated: boolean;
  wishlist: WishlistItem[];
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  wishlist: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; name: string; role?: 'customer' | 'vendor' | 'admin' }>) => {
      state.user = {
        email: action.payload.email,
        name: action.payload.name || action.payload.email.split('@')[0],
        role: action.payload.role || 'customer',
      };
      state.isAuthenticated = true;
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
