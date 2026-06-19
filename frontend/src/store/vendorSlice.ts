import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type VendorStatus = 'Active' | 'Pending Approval' | 'Suspended';

export interface Vendor {
  id: string;          // e.g. "V001"
  accessKey: string;   // secret key for vendor login
  businessName: string;
  ownerName: string;
  email: string;
  contact: string;
  category: string;
  products: number;
  revenue: number;
  status: VendorStatus;
  joinedDate: string;
}

interface VendorState {
  vendors: Vendor[];
  nextIdNumber: number;
}

const initialState: VendorState = {
  vendors: [
    {
      id: 'V001',
      accessKey: 'VK-A1B2C3D4',
      businessName: 'Tech Solutions Nepal',
      ownerName: 'Rajesh Sharma',
      email: 'rajesh@technepal.com',
      contact: '9841234567',
      category: 'Electronics',
      products: 145,
      revenue: 450000,
      status: 'Active',
      joinedDate: '2024-01-15',
    },
    {
      id: 'V002',
      accessKey: 'VK-E5F6G7H8',
      businessName: 'Kathmandu Fashion Hub',
      ownerName: 'Sita Thapa',
      email: 'sita@kfhub.com',
      contact: '9801234567',
      category: 'Fashion',
      products: 312,
      revenue: 820000,
      status: 'Active',
      joinedDate: '2024-02-20',
    },
    {
      id: 'V003',
      accessKey: 'VK-I9J0K1L2',
      businessName: 'Gadget Galaxy',
      ownerName: 'Bikash Rai',
      email: 'bikash@gadgetgalaxy.com',
      contact: '9851234567',
      category: 'Electronics',
      products: 45,
      revenue: 0,
      status: 'Pending Approval',
      joinedDate: '2024-06-01',
    },
    {
      id: 'V004',
      accessKey: 'VK-M3N4O5P6',
      businessName: 'Himalayan Organics',
      ownerName: 'Puja Gurung',
      email: 'puja@himorganics.com',
      contact: '9811234567',
      category: 'Food & Organic',
      products: 0,
      revenue: 0,
      status: 'Suspended',
      joinedDate: '2024-03-10',
    },
  ],
  nextIdNumber: 5,
};

const generateAccessKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = 'VK-';
  for (let i = 0; i < 8; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    addVendor: (state, action: PayloadAction<Omit<Vendor, 'id' | 'accessKey' | 'products' | 'revenue' | 'joinedDate'>>) => {
      const id = `V${String(state.nextIdNumber).padStart(3, '0')}`;
      const newVendor: Vendor = {
        ...action.payload,
        id,
        accessKey: generateAccessKey(),
        products: 0,
        revenue: 0,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      state.vendors.push(newVendor);
      state.nextIdNumber += 1;
    },
    updateVendorStatus: (state, action: PayloadAction<{ id: string; status: VendorStatus }>) => {
      const vendor = state.vendors.find(v => v.id === action.payload.id);
      if (vendor) {
        vendor.status = action.payload.status;
      }
    },
    deleteVendor: (state, action: PayloadAction<string>) => {
      state.vendors = state.vendors.filter(v => v.id !== action.payload);
    },
    regenerateAccessKey: (state, action: PayloadAction<string>) => {
      const vendor = state.vendors.find(v => v.id === action.payload);
      if (vendor) {
        vendor.accessKey = generateAccessKey();
      }
    },
    updateVendor: (state, action: PayloadAction<Partial<Vendor> & { id: string }>) => {
      const vendor = state.vendors.find(v => v.id === action.payload.id);
      if (vendor) {
        Object.assign(vendor, action.payload);
      }
    },
  },
});

export const { addVendor, updateVendorStatus, deleteVendor, regenerateAccessKey, updateVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
