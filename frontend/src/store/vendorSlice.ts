import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type VendorStatus = 'Active' | 'Pending Approval' | 'Suspended';

export interface VendorStoreConfig {
  logo?: string;
  banner?: string;
  themeColor?: string;
  accentColor?: string;
  showHeroSlider?: boolean;
  showPromos?: boolean;
  showCategories?: boolean;
  showFilterTabs?: boolean;
  aboutTitle?: string;
  aboutStory?: string;
  aboutMission?: string;
  featuredProducts?: string[];
}

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
  storeConfig?: VendorStoreConfig;
  kycStatus?: string;
  kycDocument?: string;
  commissionRate?: number;
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
      storeConfig: {
        logo: '',
        banner: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80',
        themeColor: '#1e3a8a',
        accentColor: '#f97316',
        showHeroSlider: true,
        showPromos: true,
        showCategories: true,
        showFilterTabs: true,
        aboutTitle: 'About Tech Solutions Nepal',
        aboutStory: 'Tech Solutions Nepal is your leading destination for premium laptops, smartphones, and smart devices. We strive to provide original and high quality tech products to our customers across Nepal.',
        aboutMission: 'To power every household in Nepal with advanced electronics and unbeatable support.',
        featuredProducts: ['1', '2']
      }
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
      storeConfig: {
        logo: '',
        banner: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
        themeColor: '#db2777',
        accentColor: '#4c1d95',
        showHeroSlider: true,
        showPromos: true,
        showCategories: true,
        showFilterTabs: true,
        aboutTitle: 'Kathmandu Fashion Hub',
        aboutStory: 'Kathmandu Fashion Hub is your modern closet for the latest fashion trends and accessories. We curate the best designer clothes, shoes, and jewelry for every occasion.',
        aboutMission: 'To bring the most premium and trendy fashion look directly to your wardrobe with ease.',
        featuredProducts: ['4']
      }
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
      storeConfig: {
        logo: '',
        banner: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80',
        themeColor: '#0f172a',
        accentColor: '#3b82f6',
        showHeroSlider: true,
        showPromos: true,
        showCategories: true,
        showFilterTabs: true,
        aboutTitle: 'Gadget Galaxy',
        aboutStory: 'A galaxy of gadgets at your fingertips. Bringing next-generation tech directly to your doorstep.',
        aboutMission: 'Democratizing smart tech for all.',
        featuredProducts: ['3']
      }
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
