import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BannerData {
  title: string;
  subtitle: string;
  buttonText: string;
  isActive: boolean;
  colorFrom: string;
  colorTo: string;
  buttonColor: string;
  backgroundImage?: string;
  link?: string;
}

interface TrendsBannerData {
  title: string;
  tag: string;
  subtitle: string;
  backgroundImage: string;
}

interface PaymentSettings {
  stripeEnabled: boolean;
  stripePublicKey: string;
  paypalEnabled: boolean;
  paypalClientId: string;
  codEnabled: boolean;
}

interface UserDashboardConfig {
  showStatsBar: boolean;
  showMyOrders: boolean;
  showCustomerService: boolean;
  showWishlistTab: boolean;
  showFollowingTab: boolean;
  showHistoryTab: boolean;
}

interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  logoText: string;
  logoImage?: string;
}

interface NavigationLink {
  id: string;
  label: string;
  url: string;
}

export interface AppCategory {
  id: string;
  name: string;
  img: string;
}

export interface TrendItem {
  id: string;
  name: string;
  price: number;
  img: string;
  sold: string;
}

interface SiteState {
  banner: BannerData;
  banners: BannerData[];
  trendsBanner: TrendsBannerData;
  theme: ThemeConfig;
  navigation: NavigationLink[];
  appCategories: AppCategory[];
  trendsFeed: TrendItem[];
  trendsTabs: string[];
  paymentSettings: PaymentSettings;
  userDashboardConfig: UserDashboardConfig;
}

const initialState: SiteState = {
  banner: {
    title: 'Mega Electronics Sale',
    subtitle: 'Up to 40% off on top brands',
    buttonText: 'Shop Now',
    isActive: true,
    colorFrom: '#1e3a8a',
    colorTo: '#4338ca',
    buttonColor: '#f97316',
  },
  banners: [
    {
      title: 'Mega Discount',
      subtitle: 'Up to 40% off on top brands',
      buttonText: 'Shop Now',
      isActive: true,
      colorFrom: '#1e3a8a',
      colorTo: '#4338ca',
      buttonColor: '#f97316',
      backgroundImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&q=80&auto=format&fit=crop',
      link: '/category/Electronics',
    },
    {
      title: 'Summer Fashion Fest',
      subtitle: 'Fresh styles & premium looks at 50% off',
      buttonText: 'Explore Collection',
      isActive: true,
      colorFrom: '#db2777',
      colorTo: '#4c1d95',
      buttonColor: '#ec4899',
      backgroundImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80&auto=format&fit=crop',
      link: '/category/Women',
    },
    {
      title: 'Kids Fashion & Wear',
      subtitle: 'Bright colors and cute styles for little ones',
      buttonText: 'Shop Kids',
      isActive: true,
      colorFrom: '#78350f',
      colorTo: '#450a0a',
      buttonColor: '#eab308',
      backgroundImage: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=1600&q=80&auto=format&fit=crop',
      link: '/category/Kids',
    },
    {
      title: 'Elite Shoe Showcase',
      subtitle: 'Step into premium comfort and quality',
      buttonText: 'View Shoes',
      isActive: true,
      colorFrom: '#064e3b',
      colorTo: '#0f172a',
      buttonColor: '#10b981',
      backgroundImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&q=80&auto=format&fit=crop',
      link: '/category/Shoes',
    }
  ],
  trendsBanner: {
    title: '# OceanStory',
    tag: 'HOT TOP 10',
    subtitle: 'Feel the wave of OceanStory!',
    backgroundImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop',
  },
  theme: {
    primaryColor: '#1e3a8a', // blue-900
    accentColor: '#f97316',  // orange-500
    logoText: 'MegaMart',
  },
  paymentSettings: {
    stripeEnabled: true,
    stripePublicKey: 'pk_test_12345',
    paypalEnabled: false,
    paypalClientId: '',
    codEnabled: true,
  },
  userDashboardConfig: {
    showStatsBar: true,
    showMyOrders: true,
    showCustomerService: true,
    showWishlistTab: true,
    showFollowingTab: true,
    showHistoryTab: true,
  },
  navigation: [
    { id: '1', label: 'All Categories', url: '/categories' },
    { id: '2', label: 'Daily Deals', url: '/deals' },
    { id: '3', label: 'Electronics', url: '/electronics' },
    { id: '4', label: 'Fashion', url: '/fashion' },
    { id: '5', label: 'Home & Kitchen', url: '/home' },
    { id: '6', label: 'Groceries', url: '/groceries' },
  ],
  appCategories: [
    { id: '1', name: 'Women', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&h=150&fit=crop' },
    { id: '2', name: 'Men', img: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=150&h=150&fit=crop' },
    { id: '3', name: 'Kids', img: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=150&h=150&fit=crop' },
    { id: '4', name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=150&h=150&fit=crop' },
    { id: '5', name: 'Shoes', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&h=150&fit=crop' },
    { id: '6', name: 'Jewelry', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop' },
    { id: '7', name: 'PUBG', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&h=150&fit=crop' },
    { id: '8', name: 'Dresses', img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=150&h=150&fit=crop' },
  ],
  trendsTabs: ['For You', 'Women Bags', 'Men Clothing'],
  trendsFeed: [
    { id: '1', name: '2pcs/1pc Women Solid Color Handbag', price: 2.90, img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&h=400&fit=crop', sold: '100+' },
    { id: '2', name: 'Francila Women\'s French Shirt', price: 8.60, img: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=400&h=400&fit=crop', sold: '80+' },
    { id: '3', name: 'Summer Elegant Maxi Dress', price: 15.50, img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop', sold: '250+' },
    { id: '4', name: 'Minimalist Sunglasses', price: 4.20, img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop', sold: '500+' },
  ]
};

export const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    updateBanner: (state, action: PayloadAction<BannerData>) => {
      state.banner = action.payload;
      if (state.banners && state.banners.length > 0) {
        state.banners[0] = { ...state.banners[0], ...action.payload };
      }
    },
    updateBanners: (state, action: PayloadAction<BannerData[]>) => {
      state.banners = action.payload;
      if (action.payload.length > 0) {
        state.banner = { ...state.banner, ...action.payload[0] };
      }
    },
    updateTrendsBanner: (state, action: PayloadAction<TrendsBannerData>) => {
      state.trendsBanner = action.payload;
    },
    updateTrendsTabs: (state, action: PayloadAction<string[]>) => {
      state.trendsTabs = action.payload;
    },
    updatePaymentSettings: (state, action: PayloadAction<PaymentSettings>) => {
      state.paymentSettings = action.payload;
    },
    updateUserDashboardConfig: (state, action: PayloadAction<UserDashboardConfig>) => {
      state.userDashboardConfig = action.payload;
    },
    updateTheme: (state, action: PayloadAction<ThemeConfig>) => {
      state.theme = action.payload;
    },
    updateNavigation: (state, action: PayloadAction<NavigationLink[]>) => {
      state.navigation = action.payload;
    },
    updateAppCategories: (state, action: PayloadAction<AppCategory[]>) => {
      state.appCategories = action.payload;
    },
    updateTrendsFeed: (state, action: PayloadAction<TrendItem[]>) => {
      state.trendsFeed = action.payload;
    },
    incrementTrends: (state, action: PayloadAction<{ id: string; name: string; price: number; image: string; quantity: number }[]>) => {
      action.payload.forEach(cartItem => {
        const existingTrend = state.trendsFeed.find(t => t.id === cartItem.id);
        if (existingTrend) {
          const currentSold = parseInt(existingTrend.sold.replace(/[^0-9]/g, '')) || 0;
          existingTrend.sold = `${currentSold + cartItem.quantity}+`;
        } else {
          state.trendsFeed.unshift({
            id: cartItem.id,
            name: cartItem.name,
            price: cartItem.price,
            img: cartItem.image,
            sold: `${cartItem.quantity}+`,
          });
        }
      });
    },
  },
});

export const { updateBanner, updateBanners, updateTrendsBanner, updateTrendsTabs, updateTheme, updateNavigation, updateAppCategories, updateTrendsFeed, incrementTrends, updatePaymentSettings, updateUserDashboardConfig } = siteSlice.actions;
export default siteSlice.reducer;
