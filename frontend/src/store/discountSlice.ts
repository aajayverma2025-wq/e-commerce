import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DiscountType = 'percentage' | 'fixed';
export type DiscountStatus = 'Active' | 'Scheduled' | 'Expired' | 'Disabled';
export type DiscountTarget = 'all' | 'category' | 'product';

export interface Discount {
  id: string;
  code: string;           // Coupon code e.g. SAVE20
  label: string;          // Display name e.g. "Summer Sale"
  type: DiscountType;     // 'percentage' | 'fixed'
  value: number;          // e.g. 20 (for 20% or $20 off)
  minOrder: number;       // Minimum order amount
  maxUses: number;        // 0 = unlimited
  usedCount: number;
  target: DiscountTarget; // who it applies to
  targetValue: string;    // category name or product id if target != 'all'
  startDate: string;
  endDate: string;
  status: DiscountStatus;
  showBanner: boolean;    // show promo banner on storefront
  bannerText: string;     // e.g. "Use code SAVE20 for 20% off!"
}

interface DiscountState {
  discounts: Discount[];
  nextIdNumber: number;
}

const initialState: DiscountState = {
  discounts: [
    {
      id: 'D001',
      code: 'WELCOME10',
      label: 'Welcome Discount',
      type: 'percentage',
      value: 10,
      minOrder: 0,
      maxUses: 0,
      usedCount: 47,
      target: 'all',
      targetValue: '',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      showBanner: true,
      bannerText: 'New here? Use code WELCOME10 for 10% off your first order!',
    },
    {
      id: 'D002',
      code: 'FLASH40',
      label: 'Flash Sale',
      type: 'percentage',
      value: 40,
      minOrder: 50,
      maxUses: 100,
      usedCount: 83,
      target: 'category',
      targetValue: 'Electronics',
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      status: 'Expired',
      showBanner: false,
      bannerText: '⚡ Flash Sale! 40% off Electronics. Use FLASH40',
    },
    {
      id: 'D003',
      code: 'SAVE500',
      label: 'Fixed Rs. 500 Off',
      type: 'fixed',
      value: 500,
      minOrder: 2000,
      maxUses: 50,
      usedCount: 12,
      target: 'all',
      targetValue: '',
      startDate: '2024-07-01',
      endDate: '2024-08-31',
      status: 'Scheduled',
      showBanner: true,
      bannerText: 'Get Rs. 500 off on orders above Rs. 2000! Code: SAVE500',
    },
  ],
  nextIdNumber: 4,
};

const discountSlice = createSlice({
  name: 'discounts',
  initialState,
  reducers: {
    addDiscount: (state, action: PayloadAction<Omit<Discount, 'id' | 'usedCount'>>) => {
      const id = `D${String(state.nextIdNumber).padStart(3, '0')}`;
      state.discounts.push({ ...action.payload, id, usedCount: 0 });
      state.nextIdNumber += 1;
    },
    updateDiscount: (state, action: PayloadAction<Discount>) => {
      const idx = state.discounts.findIndex(d => d.id === action.payload.id);
      if (idx !== -1) state.discounts[idx] = action.payload;
    },
    deleteDiscount: (state, action: PayloadAction<string>) => {
      state.discounts = state.discounts.filter(d => d.id !== action.payload);
    },
    toggleDiscountStatus: (state, action: PayloadAction<{ id: string; status: DiscountStatus }>) => {
      const d = state.discounts.find(d => d.id === action.payload.id);
      if (d) d.status = action.payload.status;
    },
    toggleBanner: (state, action: PayloadAction<string>) => {
      const d = state.discounts.find(d => d.id === action.payload);
      if (d) d.showBanner = !d.showBanner;
    },
  },
});

export const { addDiscount, updateDiscount, deleteDiscount, toggleDiscountStatus, toggleBanner } = discountSlice.actions;
export default discountSlice.reducer;
