"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateVendor } from '@/store/vendorSlice';
import { addProduct, deleteProduct, updateProduct, Product } from '@/store/productSlice';
import { addDiscount, deleteDiscount, Discount } from '@/store/discountSlice';
import { updateOrderStatus, cancelOrder } from '@/store/orderSlice';
import { logout } from '@/store/userSlice';
import { addPayoutRequest } from '@/store/paymentSlice';
import { 
  Store, LayoutDashboard, Palette, Package, FileText, LogOut, CheckCircle, 
  Trash2, Plus, Info, RefreshCw, Layers, ShoppingBag, DollarSign, 
  TrendingUp, Users, MessageSquare, AlertTriangle, Eye, Edit, 
  HelpCircle, Shield, Send, Receipt, Truck, PlusCircle, Check, X, Download, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function VendorDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get active session user
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const { vendors } = useAppSelector((state) => state.vendors);
  const allProducts = useAppSelector((state) => state.products.items);
  const { items: allOrders } = useAppSelector((state) => state.orders);
  const { discounts } = useAppSelector((state) => state.discounts);
  const { refundRequests } = useAppSelector((state) => state.payments);
  const { carriers, zones } = useAppSelector((state) => state.shipping);

  const vendorId = user?.vendorId;
  const currentVendor = vendors.find(v => v.id === vendorId);

  const rehydrated = useAppSelector((state: any) => state._persist?.rehydrated);

  // Redirection checks
  useEffect(() => {
    if (!rehydrated) return;
    if (!isAuthenticated || user?.role !== 'vendor' || !vendorId) {
      router.push('/vendor/login');
    }
  }, [rehydrated, isAuthenticated, user, vendorId, router]);

  // Sidebar Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'wallet' | 'promotions' | 'customers' | 'storefront' | 'settings' | 'support'>('overview');
  
  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Local helper: Normalizes order item ID to match catalog product ID
  const getCatalogProductId = (orderItemId: string) => {
    return orderItemId.replace(/^p/, ''); // E.g., 'p1' -> '1'
  };

  // Filter items that belong to this vendor
  const vendorProducts = allProducts.filter(p => p.vendorId === vendorId);
  const lowStockProducts = vendorProducts.filter(p => p.stock <= 10);

  // Filter orders that contain this vendor's products
  const vendorOrders = allOrders.filter(order => 
    order.items.some(item => {
      const prodId = getCatalogProductId(item.id);
      const prod = allProducts.find(p => p.id === prodId);
      return prod && prod.vendorId === vendorId;
    })
  );

  // Calculate Vendor Sales & Revenue
  const calculateVendorSales = () => {
    let salesTotal = 0;
    let ordersCount = 0;
    let pendingCount = 0;

    vendorOrders.forEach(order => {
      let containsVendorProduct = false;
      order.items.forEach(item => {
        const prodId = getCatalogProductId(item.id);
        const prod = allProducts.find(p => p.id === prodId);
        if (prod && prod.vendorId === vendorId) {
          salesTotal += item.price * item.quantity;
          containsVendorProduct = true;
        }
      });
      if (containsVendorProduct) {
        ordersCount++;
        if (order.status === 'Pending') {
          pendingCount++;
        }
      }
    });

    return { salesTotal, ordersCount, pendingCount };
  };

  const { salesTotal, ordersCount, pendingCount } = calculateVendorSales();

  const { payoutRequests } = useAppSelector(state => state.payments);
  const vendorPayoutRequests = (payoutRequests || []).filter(p => p.vendorId === vendorId);
  const approvedWithdrawals = vendorPayoutRequests.filter(w => w.status === 'Approved').reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = (salesTotal * 0.9) - approvedWithdrawals; // 90% vendor share after 10% commission

  // Vendor Refund Requests
  const vendorRefundRequests = refundRequests.filter(req => 
    vendorOrders.some(order => order.id === req.orderId)
  );

  // Vendor Coupons
  const vendorCoupons = discounts.filter(c => c.targetValue === vendorId || c.target === 'all');

  // Customer Chat State (Mock)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Sita Gurung', product: 'Sony WH-1000XM5', message: 'Is this item authentic or copy?', date: 'Just now', replied: false },
    { id: 2, sender: 'Ram Thapa', product: 'MacBook Air M2', message: 'Do you provide a keyboard overlay with this model?', date: '2 hours ago', replied: true }
  ]);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyingMessageId, setReplyingMessageId] = useState<number | null>(null);

  const handleSendReply = (msgId: number) => {
    setMessages(messages.map(m => m.id === msgId ? { ...m, replied: true } : m));
    setReplyingMessageId(null);
    setReplyMessage('');
    triggerToast('Message sent to customer successfully.');
  };

  // Support Tickets State (Mock)
  const [tickets, setTickets] = useState([
    { id: 'TCK-504', subject: 'Payout delay clarification', priority: 'Medium', status: 'Open', date: '2026-06-19' },
    { id: 'TCK-210', subject: 'Verification Documents Upload error', priority: 'High', status: 'Resolved', date: '2026-06-15' }
  ]);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState('Medium');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTickets([
      {
        id: `TCK-${Math.floor(Math.random() * 900) + 100}`,
        subject: newTicketSubject,
        priority: newTicketPriority,
        status: 'Open',
        date: new Date().toISOString().split('T')[0]
      },
      ...tickets
    ]);
    setNewTicketSubject('');
    setNewTicketMessage('');
    setShowAddTicketModal(false);
    triggerToast('Support ticket raised. Admin will respond shortly.');
  };

  // Product Modals State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form Input State
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Electronics');
  const [prodImage, setProdImage] = useState('');
  const [prodStock, setProdStock] = useState('50');
  const [prodSKU, setProdSKU] = useState('');
  const [prodVariants, setProdVariants] = useState('Size: Medium, Color: Black');

  // Coupon Modals State
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponLabel, setCouponLabel] = useState('');
  const [couponValue, setCouponValue] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponMinOrder, setCouponMinOrder] = useState('0');

  // Withdrawal Modals State
  const [showAddWithdrawalModal, setShowAddWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalBank, setWithdrawalBank] = useState('Global IME Bank');
  const [withdrawalAccount, setWithdrawalAccount] = useState('');

  // Store Customizer & Details State
  const [logo, setLogo] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [themeColor, setThemeColor] = useState('#1e3a8a');
  const [accentColor, setAccentColor] = useState('#f97316');
  const [showHeroSlider, setShowHeroSlider] = useState(true);
  const [showPromos, setShowPromos] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [showFilterTabs, setShowFilterTabs] = useState(true);
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutStory, setAboutStory] = useState('');
  const [aboutMission, setAboutMission] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<string[]>([]);

  // Bank & KYC Details
  const [bankName, setBankName] = useState('Nabil Bank');
  const [accountTitle, setAccountTitle] = useState('Tech Solutions Nepal Pvt. Ltd.');
  const [accountNumber, setAccountNumber] = useState('0123456789012');
  const [kycStatus, setKycStatus] = useState<'Pending' | 'Verified' | 'Not Submitted'>('Verified');
  const [kycFile, setKycFile] = useState<string | null>('citizenship_front.jpg');

  // Shipping Configuration
  const [customStandardRate, setCustomStandardRate] = useState(150);
  const [customExpressRate, setCustomExpressRate] = useState(300);
  const [customFreeShippingThreshold, setCustomFreeShippingThreshold] = useState(1500);

  // Sync Storefront Builder Form when vendor profile loads
  useEffect(() => {
    if (!rehydrated) return;
    if (currentVendor?.storeConfig) {
      const config = currentVendor.storeConfig;
      setLogo(config.logo || '');
      setBannerUrl(config.banner || '');
      setThemeColor(config.themeColor || '#1e3a8a');
      setAccentColor(config.accentColor || '#f97316');
      setShowHeroSlider(config.showHeroSlider !== false);
      setShowPromos(config.showPromos !== false);
      setShowCategories(config.showCategories !== false);
      setShowFilterTabs(config.showFilterTabs !== false);
      setAboutTitle(config.aboutTitle || currentVendor.businessName);
      setAboutStory(config.aboutStory || '');
      setAboutMission(config.aboutMission || '');
      setFeaturedProducts(config.featuredProducts || []);
    } else if (currentVendor) {
      setAboutTitle(currentVendor.businessName);
    }
  }, [rehydrated, currentVendor]);

  // Handle Logo Upload File
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setLogo(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  // Handle Banner Upload File
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setBannerUrl(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save Storefront Customizations
  const handleSaveStorefront = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) return;
    dispatch(updateVendor({
      id: vendorId,
      storeConfig: {
        logo,
        banner: bannerUrl,
        themeColor,
        accentColor,
        showHeroSlider,
        showPromos,
        showCategories,
        showFilterTabs,
        aboutTitle,
        aboutStory,
        aboutMission,
        featuredProducts,
      }
    }));
    triggerToast('Your storefront settings have been saved!');
  };

  // Handle Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) return;

    const priceNum = parseFloat(prodPrice);
    const origPriceNum = parseFloat(prodOriginalPrice) || undefined;
    const stockNum = parseInt(prodStock) || 0;

    dispatch(addProduct({
      name: prodName,
      price: priceNum,
      originalPrice: origPriceNum,
      discount: origPriceNum && origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : undefined,
      category: prodCategory,
      image: prodImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150',
      images: [prodImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150'],
      stock: stockNum,
      status: stockNum > 10 ? 'In Stock' : stockNum > 0 ? 'Low Stock' : 'Out of Stock',
      rating: 4.5,
      reviews: 1,
      vendorId: vendorId,
    }));

    // Reset Form
    setProdName('');
    setProdPrice('');
    setProdOriginalPrice('');
    setProdImage('');
    setProdStock('50');
    setShowAddProductModal(false);
    
    triggerToast('New product added to your catalog successfully.');
  };

  // Open Edit Product Modal
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdPrice(p.price.toString());
    setProdOriginalPrice(p.originalPrice?.toString() || '');
    setProdCategory(p.category);
    setProdImage(p.image);
    setProdStock(p.stock.toString());
    setShowEditProductModal(true);
  };

  // Handle Edit Product Submit
  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const priceNum = parseFloat(prodPrice);
    const origPriceNum = parseFloat(prodOriginalPrice) || undefined;
    const stockNum = parseInt(prodStock) || 0;

    dispatch(updateProduct({
      ...editingProduct,
      name: prodName,
      price: priceNum,
      originalPrice: origPriceNum,
      discount: origPriceNum && origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : undefined,
      category: prodCategory,
      image: prodImage,
      stock: stockNum,
      status: stockNum > 10 ? 'In Stock' : stockNum > 0 ? 'Low Stock' : 'Out of Stock',
    }));

    setShowEditProductModal(false);
    setEditingProduct(null);
    triggerToast('Product details updated successfully.');
  };

  // Handle Add Coupon
  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addDiscount({
      code: couponCode.toUpperCase(),
      label: couponLabel,
      type: couponType,
      value: parseFloat(couponValue),
      minOrder: parseFloat(couponMinOrder),
      maxUses: 100,
      target: 'all',
      targetValue: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2027-12-31',
      status: 'Active',
      showBanner: true,
      bannerText: `Use code ${couponCode.toUpperCase()} to save!`
    }));
    setCouponCode('');
    setCouponLabel('');
    setCouponValue('');
    setCouponMinOrder('0');
    setShowAddCouponModal(false);
    triggerToast('New coupon created successfully.');
  };

  // Handle Create Withdrawal Request
  const handleAddWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (amount > availableBalance) {
      alert('Withdrawal amount exceeds available balance!');
      return;
    }
    dispatch(addPayoutRequest({
      vendorId: vendorId || '',
      businessName: currentVendor?.businessName || '',
      amount,
      bankName: withdrawalBank,
      accountNumber: withdrawalAccount
    }));
    setWithdrawalAmount('');
    setShowAddWithdrawalModal(false);
    triggerToast('Withdrawal request submitted successfully.');
  };

  // Handle Order Status Transitions
  const handleAcceptOrder = (orderId: string) => {
    dispatch(updateOrderStatus({ id: orderId, status: 'Processing' }));
    triggerToast(`Order ${orderId} accepted.`);
  };

  const handleRejectOrder = (orderId: string) => {
    dispatch(cancelOrder(orderId));
    triggerToast(`Order ${orderId} rejected/cancelled.`);
  };

  const handleShipOrder = (orderId: string) => {
    dispatch(updateOrderStatus({ id: orderId, status: 'Shipped' }));
    triggerToast(`Order ${orderId} marked as Shipped.`);
  };

  const handleDeliverOrder = (orderId: string) => {
    dispatch(updateOrderStatus({ id: orderId, status: 'Delivered' }));
    triggerToast(`Order ${orderId} marked as Delivered.`);
  };

  // Mock Invoice Print
  const printInvoice = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #ddd; padding-bottom: 20px; margin-bottom: 20px; }
            .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
            th { background: #f9f9f9; }
            .total { text-align: right; font-weight: bold; font-size: 1.2em; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>INVOICE</h2>
            <p>Order ID: ${order.id}</p>
            <p>Date: ${order.date}</p>
          </div>
          <div class="details">
            <div>
              <strong>Billed To:</strong><br>
              ${order.customer}<br>
              ${order.address}, ${order.city}<br>
              ${order.phone}
            </div>
            <div>
              <strong>Sold By:</strong><br>
              ${currentVendor?.businessName}<br>
              ${currentVendor?.ownerName}<br>
              ${currentVendor?.email}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item: any) => `
                <tr>
                  <td>${item.name}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>${item.quantity}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            Total: ${order.total}
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    router.push('/vendor/login');
  };

  // Toggle selection for featured products
  const handleToggleFeaturedProduct = (prodId: string) => {
    if (featuredProducts.includes(prodId)) {
      setFeaturedProducts(featuredProducts.filter(id => id !== prodId));
    } else {
      if (featuredProducts.length >= 4) {
        alert('You can select a maximum of 4 featured products.');
        return;
      }
      setFeaturedProducts([...featuredProducts, prodId]);
    }
  };

  if (!currentVendor) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <Store className="text-orange-500" size={24} />
          <div>
            <h1 className="font-extrabold text-sm tracking-wide truncate max-w-[150px]">{currentVendor.businessName}</h1>
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Vendor Dashboard</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-xs ${
              activeTab === 'overview' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={16} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-xs ${
              activeTab === 'products' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Package size={16} /> Products ({vendorProducts.length})
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-xs ${
              activeTab === 'orders' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShoppingBag size={16} /> Orders ({vendorOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab('wallet')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-xs ${
              activeTab === 'wallet' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <DollarSign size={16} /> Wallet & Earnings
          </button>
          <button 
            onClick={() => setActiveTab('promotions')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-xs ${
              activeTab === 'promotions' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <TrendingUp size={16} /> Marketing & Coupons
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-xs ${
              activeTab === 'customers' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users size={16} /> Customers & Chat
          </button>
          <button 
            onClick={() => setActiveTab('storefront')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-xs ${
              activeTab === 'storefront' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Palette size={16} /> Store Customizer
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-xs ${
              activeTab === 'settings' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers size={16} /> Settings & Shipping
          </button>
          <button 
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-xs ${
              activeTab === 'support' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <HelpCircle size={16} /> Support & Security
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link href={`/shop/${vendorId}`} target="_blank">
            <span className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer block text-center">
              <Store size={14} /> Live Storefront 🔗
            </span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 rounded-lg text-xs font-bold transition-all"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto max-w-6xl">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-green-400 animate-bounce text-xs font-bold">
            <CheckCircle size={18} /> {toastMessage}
          </div>
        )}

        {/* Title */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'products' && 'Product Management'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'wallet' && 'Payment & Wallet'}
              {activeTab === 'promotions' && 'Promotions & Marketing'}
              {activeTab === 'customers' && 'Customer Management'}
              {activeTab === 'storefront' && 'Store Customizer'}
              {activeTab === 'settings' && 'Settings & Shipping'}
              {activeTab === 'support' && 'Support Center & Security'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Store Owner: <span className="font-bold text-gray-700">{currentVendor.ownerName}</span> | Manage details below.
            </p>
          </div>
          <span className="text-[10px] bg-green-50 border border-green-200 text-green-700 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
            ● Status: {currentVendor.status}
          </span>
        </div>

        {/* ── Tab 1: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><DollarSign size={20} /></div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Sales</span>
                  <span className="text-lg font-black text-slate-800">${salesTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><ShoppingBag size={20} /></div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
                  <span className="text-lg font-black text-slate-800">{ordersCount}</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600"><AlertTriangle size={20} /></div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pending Orders</span>
                  <span className="text-lg font-black text-slate-800">{pendingCount}</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-xl text-green-600"><Package size={20} /></div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Available Wallet</span>
                  <span className="text-lg font-black text-slate-800">${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Performance Chart (CSS bar chart) */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="text-orange-500" size={16} /> Weekly Sales Performance
                  </h3>
                  <select className="bg-gray-50 border border-gray-200 text-[10px] font-bold rounded-lg px-2 py-1 focus:outline-none">
                    <option>This Week</option>
                    <option>Last Week</option>
                  </select>
                </div>
                
                {/* CSS Bar Chart */}
                <div className="flex-1 flex items-end gap-4 h-48 relative mt-4">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="w-full border-t border-dashed border-gray-100 h-0"></div>
                    ))}
                  </div>
                  <div className="w-full h-full flex items-end justify-between z-10 px-4">
                    {[
                      { day: 'Mon', amount: salesTotal * 0.1, val: 20 },
                      { day: 'Tue', amount: salesTotal * 0.15, val: 35 },
                      { day: 'Wed', amount: salesTotal * 0.05, val: 12 },
                      { day: 'Thu', amount: salesTotal * 0.25, val: 65 },
                      { day: 'Fri', amount: salesTotal * 0.3, val: 80 },
                      { day: 'Sat', amount: salesTotal * 0.1, val: 22 },
                      { day: 'Sun', amount: salesTotal * 0.05, val: 10 },
                    ].map((data, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5 w-full group">
                        <div className="relative w-full flex justify-center h-32 items-end">
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-[10px] py-1 px-1.5 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">
                            ${data.amount.toFixed(2)}
                          </div>
                          <div 
                            className="w-6 bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-md hover:opacity-85 cursor-pointer transition-all duration-300"
                            style={{ height: `${data.val}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500">{data.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Side Alerts Panel */}
              <div className="space-y-4">
                {/* Low Stock Alerts */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-3 border-b pb-2">
                    <AlertTriangle className="text-red-500" size={14} /> Low Stock Alerts ({lowStockProducts.length})
                  </h4>
                  {lowStockProducts.length === 0 ? (
                    <p className="text-[10px] text-gray-400 font-medium">All products are healthy in stock.</p>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {lowStockProducts.slice(0, 3).map(p => (
                        <div key={p.id} className="flex justify-between items-center text-xs">
                          <span className="text-gray-700 truncate max-w-[120px] font-medium">{p.name}</span>
                          <span className="text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">{p.stock} left</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Customer Messages */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-3 border-b pb-2">
                    <MessageSquare className="text-blue-500" size={14} /> Unread Messages
                  </h4>
                  <div className="space-y-2.5">
                    {messages.filter(m => !m.replied).slice(0, 2).map(m => (
                      <div key={m.id} className="text-xs p-2 bg-gray-50 rounded-lg">
                        <div className="flex justify-between font-bold text-gray-700 mb-1">
                          <span>{m.sender}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{m.date}</span>
                        </div>
                        <p className="text-gray-500 text-[10px] line-clamp-1">{m.message}</p>
                      </div>
                    ))}
                    {messages.filter(m => !m.replied).length === 0 && (
                      <p className="text-[10px] text-gray-400 font-medium">No new customer inquiries.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders & Top Selling Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders Table */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h3 className="text-sm font-extrabold text-gray-800 mb-4">Recent Orders</h3>
                {vendorOrders.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-400 font-medium">No orders recorded yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                          <th className="pb-2">Order ID</th>
                          <th className="pb-2">Customer</th>
                          <th className="pb-2">Total</th>
                          <th className="pb-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendorOrders.slice(0, 5).map(o => (
                          <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-2.5 font-semibold text-orange-500">{o.id}</td>
                            <td className="py-2.5 text-gray-600 font-medium">{o.customer}</td>
                            <td className="py-2.5 font-bold font-mono text-gray-700">{o.total}</td>
                            <td className="py-2.5 text-right">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                o.status === 'Delivered' ? 'bg-green-50 text-green-700' :
                                o.status === 'Processing' ? 'bg-blue-50 text-blue-700' :
                                o.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>{o.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Top Selling Products */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h3 className="text-sm font-extrabold text-gray-800 mb-4">Top Selling Products</h3>
                {vendorProducts.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-400 font-medium">No products in your store.</div>
                ) : (
                  <div className="space-y-3">
                    {vendorProducts.slice().sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 5).map(p => (
                      <div key={p.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <img src={p.image} className="w-8 h-8 object-contain rounded border p-0.5 bg-white" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-800 truncate max-w-[150px]">{p.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold">${p.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">{p.soldCount || 0} sold</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2: PRODUCT MANAGEMENT ── */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500">Catalog Size: {vendorProducts.length} items</span>
                <span className="text-[10px] bg-gray-100 border px-2 py-0.5 rounded-md font-bold text-gray-600">CSV Bulk Import Supported (Mock)</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => triggerToast('Mock CSV catalog template exported successfully.')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all"
                >
                  <Download size={14} /> Export CSV
                </button>
                <button 
                  onClick={() => setShowAddProductModal(true)} 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-100 transition-all"
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>
            </div>

            {vendorProducts.length === 0 ? (
              <div className="bg-white border rounded-2xl p-16 text-center text-gray-400">
                <Package size={48} className="mx-auto mb-2 opacity-25" />
                <p className="font-semibold text-sm">No products listed under your business.</p>
                <p className="text-xs mt-1">Click "Add Product" above to populate your catalog.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-100">
                      <th className="p-4">Product Info</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">SKU / Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorProducts.map(p => (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={p.image} className="w-12 h-12 object-contain bg-white rounded border p-1" />
                            <div>
                              <p className="font-bold text-sm text-gray-900 leading-tight">{p.name}</p>
                              <span className="text-[10px] text-gray-400">ID: {p.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-gray-500">{p.category}</td>
                        <td className="p-4 font-mono font-bold text-gray-800">${p.price.toFixed(2)}</td>
                        <td className="p-4">
                          <p className="font-bold text-gray-600">{p.stock} pcs</p>
                          <span className="text-[10px] text-gray-400 font-mono">SKU: PROD-SKU-{p.id}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            p.status === 'In Stock' ? 'bg-green-50 text-green-700 border border-green-200' :
                            p.status === 'Low Stock' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                          }`}>{p.status}</span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button 
                              onClick={() => openEditModal(p)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit Product"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this product?')) {
                                  dispatch(deleteProduct(p.id));
                                  triggerToast('Product deleted from store catalog.');
                                }
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 3: ORDER MANAGER ── */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs font-bold text-gray-500">Orders tracking: {vendorOrders.length} instances</span>
              <span className="text-[10px] bg-gray-100 border px-2 py-0.5 rounded-md font-bold text-gray-600">Real-time status synced</span>
            </div>

            {vendorOrders.length === 0 ? (
              <div className="bg-white border rounded-2xl p-16 text-center text-gray-400">
                <ShoppingBag size={48} className="mx-auto mb-2 opacity-25" />
                <p className="font-semibold text-sm">No customers have ordered your items yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Orders list */}
                {vendorOrders.map(order => {
                  // Find vendor specific items within the order
                  const vendorItems = order.items.filter(item => {
                    const prodId = getCatalogProductId(item.id);
                    const prod = allProducts.find(p => p.id === prodId);
                    return prod && prod.vendorId === vendorId;
                  });

                  return (
                    <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center flex-wrap gap-2 text-xs">
                        <div>
                          <p className="font-extrabold text-orange-500">{order.id}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Date: {order.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                            order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            'bg-gray-100 text-gray-600 border'
                          }`}>{order.status}</span>
                          <button 
                            onClick={() => printInvoice(order)}
                            className="bg-white border text-gray-700 font-bold hover:bg-gray-100 px-2 py-1 rounded flex items-center gap-1"
                          >
                            <Receipt size={12} /> Invoice
                          </button>
                        </div>
                      </div>

                      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                        {/* Items in order */}
                        <div className="md:col-span-2 space-y-3">
                          <h4 className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Your Products in Order</h4>
                          {vendorItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                              <div className="flex items-center gap-3">
                                <img src={item.image} className="w-10 h-10 object-contain rounded border bg-white" />
                                <div>
                                  <p className="font-bold text-gray-800">{item.name}</p>
                                  <p className="text-[10px] text-gray-400 font-bold">${item.price.toFixed(2)} × {item.quantity}</p>
                                </div>
                              </div>
                              <span className="font-bold font-mono text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Customer & Shipping Details */}
                        <div className="bg-gray-50/50 p-3 rounded-lg border space-y-2">
                          <h4 className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Shipping Details</h4>
                          <div>
                            <span className="text-[10px] text-gray-400 block font-semibold">Customer</span>
                            <p className="font-bold text-gray-800">{order.customer}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block font-semibold">Address</span>
                            <p className="font-bold text-gray-700 leading-tight">{order.address}, {order.city}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block font-semibold">Contact</span>
                            <p className="font-bold text-gray-700">{order.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Accept/Process order action bar */}
                      <div className="px-4 py-3 bg-gray-50 border-t flex justify-end gap-2 text-xs">
                        {order.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleRejectOrder(order.id)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold transition-colors"
                            >
                              Reject Order
                            </button>
                            <button 
                              onClick={() => handleAcceptOrder(order.id)}
                              className="px-4 py-1.5 bg-orange-500 text-white hover:bg-orange-600 rounded-lg font-bold shadow-sm transition-all"
                            >
                              Accept Order
                            </button>
                          </>
                        )}
                        {order.status === 'Processing' && (
                          <button 
                            onClick={() => handleShipOrder(order.id)}
                            className="px-4 py-1.5 bg-black text-white hover:bg-gray-800 rounded-lg font-bold flex items-center gap-1"
                          >
                            <Truck size={12} /> Mark as Shipped
                          </button>
                        )}
                        {order.status === 'Shipped' && (
                          <button 
                            onClick={() => handleDeliverOrder(order.id)}
                            className="px-4 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg font-bold flex items-center gap-1"
                          >
                            <Check size={12} /> Mark as Delivered
                          </button>
                        )}
                        {order.status === 'Delivered' && (
                          <span className="text-green-700 font-bold flex items-center gap-1">
                            <CheckCircle size={14} /> Completed & Shipped
                          </span>
                        )}
                        {order.status === 'Cancelled' && (
                          <span className="text-red-500 font-bold">Cancelled</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Return/Refund Requests */}
                {vendorRefundRequests.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mt-8">
                    <h3 className="text-sm font-extrabold text-gray-800 mb-4 flex items-center gap-2">
                      <RefreshCw size={16} className="text-orange-500" /> Return & Refund Requests
                    </h3>
                    <div className="space-y-3 text-xs">
                      {vendorRefundRequests.map(req => (
                        <div key={req.id} className="p-3 bg-red-50/20 border border-red-100 rounded-lg flex justify-between items-center flex-wrap gap-4">
                          <div>
                            <p className="font-bold text-gray-900">Order ID: {req.orderId}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Customer: {req.customer} | Reason: {req.reason}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold font-mono text-gray-700">${req.amount.toFixed(2)}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                              req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>{req.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Tab 4: WALLET & PAYMENTS ── */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Gross Revenue (90%)</span>
                <span className="text-2xl font-black text-slate-800 mt-2">${(salesTotal * 0.9).toFixed(2)}</span>
                <span className="text-[10px] text-gray-400 mt-1 block">MegaMart takes 10% platform fee</span>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Withdrawn to Date</span>
                <span className="text-2xl font-black text-slate-800 mt-2">${approvedWithdrawals.toFixed(2)}</span>
                <span className="text-[10px] text-gray-400 mt-1 block">Successfully settled to bank</span>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Available Balance</span>
                <span className="text-2xl font-black text-green-600 mt-2">${availableBalance.toFixed(2)}</span>
                <button 
                  onClick={() => setShowAddWithdrawalModal(true)}
                  disabled={availableBalance <= 0}
                  className="mt-2 w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold text-[10px] uppercase py-2 rounded-lg shadow-sm transition-all"
                >
                  Withdraw Funds
                </button>
              </div>
            </div>

            {/* Withdrawal History */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-gray-800 mb-4">Payout Withdrawal Requests</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                      <th className="pb-2">Request ID</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Settlement Bank</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorPayoutRequests.map((w, idx) => (
                      <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="py-3 font-semibold text-gray-700">{w.id}</td>
                        <td className="py-3 font-bold font-mono text-gray-800">${w.amount.toFixed(2)}</td>
                        <td className="py-3 text-gray-500 font-medium">{w.bankName}</td>
                        <td className="py-3 text-gray-400 font-medium">{w.date}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            w.status === 'Approved' ? 'bg-green-50 text-green-700' :
                            w.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-red-50 text-red-700'
                          }`}>{w.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 5: MARKETING & PROMOTIONS ── */}
        {activeTab === 'promotions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-wrap gap-4">
              <span className="text-xs font-bold text-gray-500">Active Store Promotions</span>
              <button 
                onClick={() => setShowAddCouponModal(true)}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Plus size={14} /> Create Coupon
              </button>
            </div>

            {/* Coupons List */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-gray-800 mb-4">Active Coupon Codes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {vendorCoupons.map((coupon, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-orange-500 font-mono text-sm tracking-wide bg-orange-50 px-2 py-0.5 rounded border border-orange-100">{coupon.code}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          coupon.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-400'
                        }`}>{coupon.status}</span>
                      </div>
                      <p className="font-bold text-gray-800 mt-1">{coupon.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Discount: <span className="font-bold text-gray-700">{coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}</span>
                      </p>
                      <p className="text-[9px] text-gray-400">Min Order: ${coupon.minOrder}</p>
                    </div>
                    {coupon.showBanner && (
                      <p className="mt-3 text-[9px] bg-white border border-gray-200 p-1.5 rounded text-gray-500 font-medium italic">
                        "{coupon.bannerText}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Flash Sale Banner Mock */}
            <div className="bg-[#fcf8f2] border border-orange-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-[#8b4513]">Scheduled Flash Sales</h4>
                <p className="text-xs text-gray-500">Configure special discounts on products to be promoted in the homepage flash section.</p>
              </div>
              <button 
                onClick={() => triggerToast('Flash Sale Campaign Manager opened (Mock)')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all"
              >
                Schedule Flash Sale
              </button>
            </div>
          </div>
        )}

        {/* ── Tab 6: CUSTOMERS & CHAT ── */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Chat Inbox */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col h-96">
                <h3 className="text-sm font-extrabold text-gray-800 mb-4 border-b pb-2 flex items-center gap-1.5">
                  <MessageSquare size={16} className="text-blue-500" /> Customer Live Support
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
                  {messages.map(msg => (
                    <div key={msg.id} className="p-3 bg-gray-50 rounded-xl border relative">
                      <div className="flex justify-between font-bold text-gray-800 mb-1">
                        <span>{msg.sender}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{msg.date}</span>
                      </div>
                      <p className="text-[10px] text-orange-500 font-semibold mb-1">Product: {msg.product}</p>
                      <p className="text-gray-600 leading-tight">{msg.message}</p>
                      
                      <div className="mt-3 flex justify-end">
                        {!msg.replied ? (
                          replyingMessageId === msg.id ? (
                            <div className="w-full space-y-2 mt-2">
                              <textarea 
                                value={replyMessage}
                                onChange={e => setReplyMessage(e.target.value)}
                                placeholder="Type your reply here..."
                                rows={2}
                                className="w-full p-2 border rounded-lg text-xs"
                              />
                              <div className="flex justify-end gap-1.5">
                                <button onClick={() => setReplyingMessageId(null)} className="px-2.5 py-1 bg-gray-200 rounded text-[10px] font-bold">Cancel</button>
                                <button onClick={() => handleSendReply(msg.id)} className="px-3 py-1 bg-orange-500 text-white rounded text-[10px] font-bold flex items-center gap-1"><Send size={10} /> Send</button>
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setReplyingMessageId(msg.id)}
                              className="text-orange-500 font-bold hover:underline text-[10px] flex items-center gap-0.5"
                            >
                              Reply
                            </button>
                          )
                        ) : (
                          <span className="text-green-600 font-bold flex items-center gap-0.5 text-[10px]">
                            <Check size={12} /> Replied
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Base & Reviews */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col h-96 overflow-y-auto">
                <h3 className="text-sm font-extrabold text-gray-800 mb-4 border-b pb-2">Customer Base</h3>
                <div className="space-y-3.5 text-xs">
                  {vendorOrders.map((o, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                      <div>
                        <p className="font-bold text-gray-800">{o.customer}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{o.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-700 block">{o.total}</span>
                        <span className="text-[9px] text-gray-400 font-semibold">{o.date}</span>
                      </div>
                    </div>
                  ))}
                  {vendorOrders.length === 0 && (
                    <p className="text-center text-gray-400 py-10 font-medium">No customers logged yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 7: STOREFRONT CUSTOMIZER ── */}
        {activeTab === 'storefront' && (
          <form onSubmit={handleSaveStorefront} className="space-y-6">
            {/* Identity Settings */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b border-gray-50 pb-2 flex items-center gap-2">
                <Palette size={18} className="text-orange-500" /> Theme & Branding
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Store Logo */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Store Logo</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={logo} 
                      onChange={(e) => setLogo(e.target.value)} 
                      placeholder="Image URL" 
                      className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-4 py-2.5 rounded-xl cursor-pointer border font-bold flex-shrink-0 transition-colors">
                      Upload
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                  {logo && (
                    <div className="mt-2 w-16 h-16 rounded-xl border overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>

                {/* Store Banner */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Store Banner Image</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={bannerUrl} 
                      onChange={(e) => setBannerUrl(e.target.value)} 
                      placeholder="Image URL" 
                      className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-4 py-2.5 rounded-xl cursor-pointer border font-bold flex-shrink-0 transition-colors">
                      Upload
                      <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                    </label>
                  </div>
                  {bannerUrl && (
                    <div className="mt-2 w-32 h-16 rounded-xl border overflow-hidden bg-gray-50">
                      <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Theme Colors */}
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Theme Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-10 h-10 p-0.5 border rounded cursor-pointer" />
                    <input type="text" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="flex-1 px-3 py-2 border rounded-xl text-xs font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Theme Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 p-0.5 border rounded cursor-pointer" />
                    <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="flex-1 px-3 py-2 border rounded-xl text-xs font-mono" />
                  </div>
                </div>
              </div>
            </div>

            {/* Homepage Sections display toggles */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b border-gray-50 pb-2 flex items-center gap-2">
                <Layers size={18} className="text-orange-500" /> Homepage Sections Config
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:bg-gray-100/50 transition-colors">
                  <input type="checkbox" checked={showHeroSlider} onChange={(e) => setShowHeroSlider(e.target.checked)} className="w-4 h-4 accent-orange-500" />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Show Banner Slider</span>
                    <span className="text-[10px] text-gray-400 font-medium">Toggles the big slide banner hero at top</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:bg-gray-100/50 transition-colors">
                  <input type="checkbox" checked={showPromos} onChange={(e) => setShowPromos(e.target.checked)} className="w-4 h-4 accent-orange-500" />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Show Promo Bar</span>
                    <span className="text-[10px] text-gray-400 font-medium">Toggles Free Shipping & Flash Sale bar</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:bg-gray-100/50 transition-colors">
                  <input type="checkbox" checked={showCategories} onChange={(e) => setShowCategories(e.target.checked)} className="w-4 h-4 accent-orange-500" />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Show Circular Categories</span>
                    <span className="text-[10px] text-gray-400 font-medium">Displays circles of product category shortcuts</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:bg-gray-100/50 transition-colors">
                  <input type="checkbox" checked={showFilterTabs} onChange={(e) => setShowFilterTabs(e.target.checked)} className="w-4 h-4 accent-orange-500" />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Show Filter Navigation Tabs</span>
                    <span className="text-[10px] text-gray-400 font-medium">Allows customer tabs filtering of products</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Featured Products */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-slate-800 border-b border-gray-50 pb-2 flex items-center gap-2">
                <Store size={18} className="text-orange-500" /> Featured Storefront Products (Max 4)
              </h3>
              <p className="text-xs text-gray-400 mb-3 font-medium">Select the products you want highlighted in your store hero section.</p>
              
              {vendorProducts.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-xs font-semibold">
                  You have no products listed. Add products in the Product catalog tab to feature them.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {vendorProducts.map(p => {
                    const isSelected = featuredProducts.includes(p.id);
                    return (
                      <div 
                        key={p.id}
                        onClick={() => handleToggleFeaturedProduct(p.id)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 bg-gray-50 ${
                          isSelected ? 'border-orange-500 bg-orange-50/20' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex gap-2">
                          <img src={p.image} className="w-10 h-10 object-contain bg-white rounded border flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-gray-800 truncate">{p.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold">${p.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {isSelected ? 'Featured' : 'Select'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* About Store Page Configuration */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b border-gray-50 pb-2 flex items-center gap-2">
                <FileText size={18} className="text-orange-500" /> About Store Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">About Store Title</label>
                  <input 
                    type="text" 
                    value={aboutTitle} 
                    onChange={(e) => setAboutTitle(e.target.value)} 
                    placeholder="e.g. About Tech Solutions Nepal" 
                    className="w-full px-3.5 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-orange-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Our Story / Description</label>
                  <textarea 
                    value={aboutStory} 
                    onChange={(e) => setAboutStory(e.target.value)} 
                    placeholder="Describe your business and history..." 
                    rows={4}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-orange-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Our Mission Statement</label>
                  <input 
                    type="text" 
                    value={aboutMission} 
                    onChange={(e) => setAboutMission(e.target.value)} 
                    placeholder="What is your store's core mission?" 
                    className="w-full px-3.5 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-orange-500 text-gray-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <CheckCircle size={18} /> Save storefront settings
              </button>
            </div>
          </form>
        )}

        {/* ── Tab 8: SETTINGS & SHIPPING ── */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Account & Profile Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-gray-800 border-b pb-2">Business Profile & KYC Verification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Owner Full Name</label>
                  <input type="text" value={currentVendor.ownerName} readOnly className="w-full p-2 border rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed font-medium" />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Official Business Name</label>
                  <input type="text" value={currentVendor.businessName} readOnly className="w-full p-2 border rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed font-medium" />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">KYC Status</label>
                  <span className="mt-1 flex items-center gap-1 font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 w-fit">
                    <ShieldCheck size={14} /> KYC Verified ({kycFile})
                  </span>
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Notification Settings</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 font-medium cursor-pointer"><input type="checkbox" defaultChecked className="accent-orange-500" /> Email Alerts</label>
                    <label className="flex items-center gap-2 font-medium cursor-pointer"><input type="checkbox" defaultChecked className="accent-orange-500" /> SMS Alerts</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-gray-800 border-b pb-2">Settlement Bank Account</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Bank Name</label>
                  <input type="text" value={bankName} onChange={e => setBankName(e.target.value)} className="w-full p-2 border rounded-xl text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 font-semibold" />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Account Title</label>
                  <input type="text" value={accountTitle} onChange={e => setAccountTitle(e.target.value)} className="w-full p-2 border rounded-xl text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 font-semibold" />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Account Number</label>
                  <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="w-full p-2 border rounded-xl text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 font-semibold" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => triggerToast('Bank settlement details updated.')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-lg"
                >
                  Save Bank Details
                </button>
              </div>
            </div>

            {/* Shipping Configuration */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-gray-800 border-b pb-2 flex items-center gap-1.5"><Truck size={16} /> Courier & Shipping Rates Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Standard Shipping Charge ($)</label>
                  <input type="number" value={customStandardRate} onChange={e => setCustomStandardRate(parseInt(e.target.value))} className="w-full p-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Express Shipping Charge ($)</label>
                  <input type="number" value={customExpressRate} onChange={e => setCustomExpressRate(parseInt(e.target.value))} className="w-full p-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Free Shipping Threshold ($)</label>
                  <input type="number" value={customFreeShippingThreshold} onChange={e => setCustomFreeShippingThreshold(parseInt(e.target.value))} className="w-full p-2 border rounded-xl" />
                </div>
              </div>

              {/* Delivery Zones */}
              <div className="pt-4">
                <h4 className="font-bold text-gray-700 text-xs mb-2">Available Delivery Zones (System Config)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {zones.map((zone, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border flex items-center justify-between">
                      <span className="font-bold text-gray-700">{zone.name}</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${zone.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* General Store Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-gray-800 border-b pb-2">Tax & Opening Hours Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Tax Percentage (%)</label>
                  <input type="number" defaultValue="13" className="w-full p-2 border rounded-xl bg-gray-50 text-gray-500" readOnly />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Store Opening Time</label>
                  <input type="text" defaultValue="09:00 AM" className="w-full p-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Store Closing Time</label>
                  <input type="text" defaultValue="08:00 PM" className="w-full p-2 border rounded-xl" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => triggerToast('Opening hours and tax profiles saved.')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-lg"
                >
                  Save Store Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 9: SUPPORT & SECURITY ── */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Raise Support Ticket */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h3 className="text-sm font-extrabold text-gray-800">Support Center</h3>
                  <button 
                    onClick={() => setShowAddTicketModal(true)}
                    className="bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1"
                  >
                    <Plus size={10} /> Raise Ticket
                  </button>
                </div>
                <div className="space-y-3 text-xs">
                  {tickets.map((t, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-xl border flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800">{t.subject}</span>
                          <span className="text-[9px] text-gray-400 font-medium">({t.id})</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">Opened: {t.date} | Priority: <span className={`font-bold ${t.priority === 'High' ? 'text-red-500' : 'text-gray-500'}`}>{t.priority}</span></p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        t.status === 'Resolved' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>{t.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section & Live Admin Chat */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <h3 className="text-sm font-extrabold text-gray-800 mb-3 border-b pb-2">Frequently Asked Help</h3>
                  <div className="space-y-3 text-xs">
                    <details className="group border-b pb-2 cursor-pointer">
                      <summary className="font-bold text-gray-700 hover:text-orange-500 list-none flex justify-between items-center">
                        How is my wallet payout calculated?
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="text-gray-500 text-[10px] mt-1.5 leading-relaxed">
                        MegaMart charges a flat 10% commission fee on each transaction. The remaining 90% is calculated as your gross earnings. You can withdraw available funds anytime into your registered bank account.
                      </p>
                    </details>
                    <details className="group border-b pb-2 cursor-pointer">
                      <summary className="font-bold text-gray-700 hover:text-orange-500 list-none flex justify-between items-center">
                        How long does KYC verification take?
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="text-gray-500 text-[10px] mt-1.5 leading-relaxed">
                        Once you upload your registration document/citizenship in the settings profile, our team verifies it within 24 to 48 working hours.
                      </p>
                    </details>
                  </div>
                </div>

                {/* Mock Security Panel */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-gray-800 border-b pb-2 flex items-center gap-1.5"><Shield size={16} className="text-orange-500" /> Account Security</h3>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:bg-gray-100/50 transition-colors">
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
                      <div>
                        <span className="font-bold text-gray-800 block">Two-Factor Authentication (2FA)</span>
                        <span className="text-[10px] text-gray-400 font-medium">Protect account with verification codes</span>
                      </div>
                    </label>
                    <div className="p-2 border rounded-xl bg-gray-50 text-[10px] text-gray-400 font-mono">
                      Last Login: {new Date().toLocaleString()} from Kathmandu, Nepal (IP: 192.168.1.80)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── ADD PRODUCT MODAL ── */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border">
            <div className="p-5 bg-gray-50 border-b flex justify-between items-center text-xs">
              <span className="font-extrabold text-gray-800 text-sm">Add Product to Catalog</span>
              <button onClick={() => setShowAddProductModal(false)} className="text-gray-400 hover:text-black font-bold text-base">×</button>
            </div>
            
            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name *</label>
                <input 
                  type="text" 
                  value={prodName} 
                  onChange={(e) => setProdName(e.target.value)} 
                  required
                  placeholder="e.g. Wireless Ergonomic Mouse"
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sale Price ($) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={prodPrice} 
                    onChange={(e) => setProdPrice(e.target.value)} 
                    required
                    placeholder="29.99"
                    className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Original Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={prodOriginalPrice} 
                    onChange={(e) => setProdOriginalPrice(e.target.value)} 
                    placeholder="39.99"
                    className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select 
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Dresses">Dresses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Qty *</label>
                  <input 
                    type="number" 
                    value={prodStock} 
                    onChange={(e) => setProdStock(e.target.value)} 
                    required
                    className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Variants (comma separated)</label>
                <input 
                  type="text" 
                  value={prodVariants} 
                  onChange={(e) => setProdVariants(e.target.value)} 
                  placeholder="Size: Medium, Color: Black"
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Image URL</label>
                <input 
                  type="text" 
                  value={prodImage} 
                  onChange={(e) => setProdImage(e.target.value)} 
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-100 transition-all"
                >
                  Add to Store Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT PRODUCT MODAL ── */}
      {showEditProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border">
            <div className="p-5 bg-gray-50 border-b flex justify-between items-center text-xs">
              <span className="font-extrabold text-gray-800 text-sm">Modify Product Details</span>
              <button onClick={() => { setShowEditProductModal(false); setEditingProduct(null); }} className="text-gray-400 hover:text-black font-bold text-base">×</button>
            </div>
            
            <form onSubmit={handleEditProductSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name *</label>
                <input 
                  type="text" 
                  value={prodName} 
                  onChange={(e) => setProdName(e.target.value)} 
                  required
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sale Price ($) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={prodPrice} 
                    onChange={(e) => setProdPrice(e.target.value)} 
                    required
                    className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Original Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={prodOriginalPrice} 
                    onChange={(e) => setProdOriginalPrice(e.target.value)} 
                    className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select 
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Dresses">Dresses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Qty *</label>
                  <input 
                    type="number" 
                    value={prodStock} 
                    onChange={(e) => setProdStock(e.target.value)} 
                    required
                    className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Image URL</label>
                <input 
                  type="text" 
                  value={prodImage} 
                  onChange={(e) => setProdImage(e.target.value)} 
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => { setShowEditProductModal(false); setEditingProduct(null); }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-100 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE COUPON MODAL ── */}
      {showAddCouponModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border">
            <div className="p-5 bg-gray-50 border-b flex justify-between items-center text-xs">
              <span className="font-extrabold text-gray-800 text-sm">Create Discount Coupon</span>
              <button onClick={() => setShowAddCouponModal(false)} className="text-gray-400 hover:text-black font-bold text-base">×</button>
            </div>
            
            <form onSubmit={handleAddCouponSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon Code *</label>
                <input 
                  type="text" 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value)} 
                  required
                  placeholder="e.g. SAVEMORE20"
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon Label / Description *</label>
                <input 
                  type="text" 
                  value={couponLabel} 
                  onChange={(e) => setCouponLabel(e.target.value)} 
                  required
                  placeholder="e.g. Get Rs. 500 off Summer Collection"
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon Type</label>
                  <select 
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Value ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount Value *</label>
                  <input 
                    type="number" 
                    value={couponValue} 
                    onChange={(e) => setCouponValue(e.target.value)} 
                    required
                    placeholder="e.g. 15"
                    className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min Order Amount ($)</label>
                <input 
                  type="number" 
                  value={couponMinOrder} 
                  onChange={(e) => setCouponMinOrder(e.target.value)} 
                  placeholder="e.g. 50"
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddCouponModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-100 transition-all"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── WITHDRAW BALANCE MODAL ── */}
      {showAddWithdrawalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border">
            <div className="p-5 bg-gray-50 border-b flex justify-between items-center text-xs">
              <span className="font-extrabold text-gray-800 text-sm">Request Withdrawal</span>
              <button onClick={() => setShowAddWithdrawalModal(false)} className="text-gray-400 hover:text-black font-bold text-base">×</button>
            </div>
            
            <form onSubmit={handleAddWithdrawalSubmit} className="p-6 space-y-4 text-xs">
              <div className="bg-green-50 text-green-700 p-3 rounded-xl border border-green-100">
                Available Wallet Balance: <strong className="font-black">${availableBalance.toFixed(2)}</strong>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Withdrawal Amount ($) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  max={availableBalance}
                  value={withdrawalAmount} 
                  onChange={(e) => setWithdrawalAmount(e.target.value)} 
                  required
                  placeholder="e.g. 500"
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Settlement Bank Name</label>
                <select 
                  value={withdrawalBank}
                  onChange={(e) => setWithdrawalBank(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none"
                >
                  <option value="Global IME Bank">Global IME Bank</option>
                  <option value="Nabil Bank">Nabil Bank</option>
                  <option value="Nepal Investment Bank">Nepal Investment Bank</option>
                  <option value="Siddhartha Bank">Siddhartha Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Settlement Bank Account Number *</label>
                <input 
                  type="text" 
                  value={withdrawalAccount} 
                  onChange={(e) => setWithdrawalAccount(e.target.value)} 
                  required
                  placeholder="Enter Bank Account Number"
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddWithdrawalModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RAISE TICKET MODAL ── */}
      {showAddTicketModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border">
            <div className="p-5 bg-gray-50 border-b flex justify-between items-center text-xs">
              <span className="font-extrabold text-gray-800 text-sm">Raise Support Ticket</span>
              <button onClick={() => setShowAddTicketModal(false)} className="text-gray-400 hover:text-black font-bold text-base">×</button>
            </div>
            
            <form onSubmit={handleRaiseTicket} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject / Issue Summary *</label>
                <input 
                  type="text" 
                  value={newTicketSubject} 
                  onChange={(e) => setNewTicketSubject(e.target.value)} 
                  required
                  placeholder="e.g. Wallet payout not settled"
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                <select 
                  value={newTicketPriority}
                  onChange={(e) => setNewTicketPriority(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message Description *</label>
                <textarea 
                  value={newTicketMessage} 
                  onChange={(e) => setNewTicketMessage(e.target.value)} 
                  required
                  placeholder="Provide all details of the issue here..."
                  rows={4}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-orange-500 text-gray-800"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddTicketModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-100 transition-all"
                >
                  Submit Support Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
