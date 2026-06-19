"use client";

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '@/store/cartSlice';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, totalAmount, totalQuantity } = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
          Your cart is currently empty.
          <div className="mt-4">
            <Link href="/" className="text-orange-500 hover:text-orange-600 font-medium">
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="py-4 px-6 font-medium">Product</th>
                  <th className="py-4 px-6 font-medium text-center">Quantity</th>
                  <th className="py-4 px-6 font-medium text-right">Price</th>
                  <th className="py-4 px-6 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                        </div>
                        <span className="font-medium text-gray-900 line-clamp-2">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                          className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                        >-</button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                        >+</button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-4 border-t border-gray-100 flex justify-between">
              <Link href="/" className="text-orange-500 hover:text-orange-600 font-medium px-4 py-2">
                &larr; Continue Shopping
              </Link>
              <button 
                onClick={() => dispatch(clearCart())}
                className="text-gray-500 hover:text-red-500 font-medium px-4 py-2"
              >
                Clear Cart
              </button>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="flex justify-between mb-3 text-gray-600">
                <span>Items ({totalQuantity}):</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Shipping:</span>
                <span className="text-green-500 font-medium">Free</span>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-orange-500">${totalAmount.toFixed(2)}</span>
              </div>
              
              <Link href="/checkout" className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-transform hover:scale-105">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
