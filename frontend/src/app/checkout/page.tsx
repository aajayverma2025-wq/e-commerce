"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addOrder } from '@/store/orderSlice';
import { clearCart } from '@/store/cartSlice';
import { ShoppingBag, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector(state => state.cart);
  const { user } = useAppSelector(state => state.user);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'Cash on Delivery',
  });
  const [placing, setPlacing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.city) {
      alert('Please fill in all required fields.');
      return;
    }
    if (items.length === 0) {
      alert('Your cart is empty. Add items before checking out.');
      return;
    }

    setPlacing(true);
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      id: orderId,
      customer: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      postalCode: form.postalCode,
      date: new Date().toISOString().split('T')[0],
      total: `$${(totalAmount + totalAmount * 0.05).toFixed(2)}`,
      status: 'Pending' as const,
      items: items,
      paymentMethod: form.paymentMethod,
    };

    dispatch(addOrder(newOrder));
    dispatch(clearCart());

    setTimeout(() => {
      router.push(`/order-confirmation?id=${orderId}`);
    }, 800);
  };

  const subtotal = totalAmount;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <ShoppingBag className="text-orange-500" size={30} /> Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <MapPin size={20} className="text-orange-500" /> Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-900"
                    placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email *</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-900"
                    placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-900"
                    placeholder="+1 555-0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">City *</label>
                  <input name="city" value={form.city} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-900"
                    placeholder="New York" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Street Address *</label>
                  <input name="address" value={form.address} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-900"
                    placeholder="123 Main Street, Apt 4B" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Postal Code</label>
                  <input name="postalCode" value={form.postalCode} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-900"
                    placeholder="10001" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <CreditCard size={20} className="text-orange-500" /> Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Cash on Delivery', 'Credit Card', 'PayPal'].map(method => (
                  <label key={method}
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      form.paymentMethod === method
                        ? 'border-orange-400 bg-orange-50 text-orange-700 font-semibold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}>
                    <input type="radio" name="paymentMethod" value={method}
                      checked={form.paymentMethod === method}
                      onChange={handleChange} className="accent-orange-500" />
                    {method}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
              {items.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Your cart is empty.</p>
              ) : (
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax (5%)</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-green-600 font-medium">Free</span></div>
                <div className="flex justify-between text-gray-900 font-bold text-lg pt-2 border-t border-gray-100">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing || items.length === 0}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-colors text-lg shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
            >
              {placing ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing Order...</>
              ) : (
                <><CheckCircle size={20} /> Place Order</>
              )}
            </button>
            <p className="text-xs text-center text-gray-400">By placing your order, you agree to our Terms of Service.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
