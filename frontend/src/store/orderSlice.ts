import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  date: string;
  total: string;
  status: OrderStatus;
  items: CartItem[];
  paymentMethod: string;
}

interface OrderState {
  items: Order[];
}

const today = new Date().toISOString().split('T')[0];

const initialState: OrderState = {
  items: [
    {
      id: 'ORD-100001',
      customer: 'John Doe',
      email: 'john@example.com',
      phone: '+1 555-0101',
      address: '123 Main Street',
      city: 'New York',
      postalCode: '10001',
      date: today,
      total: '$1,199.00',
      status: 'Delivered',
      paymentMethod: 'Credit Card',
      items: [
        { id: 'p1', name: 'iPhone 15 Pro Max', price: 1199, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200', quantity: 1 }
      ],
    },
    {
      id: 'ORD-100002',
      customer: 'Sarah Ahmed',
      email: 'sarah@example.com',
      phone: '+1 555-0102',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      postalCode: '90001',
      date: today,
      total: '$696.00',
      status: 'Processing',
      paymentMethod: 'PayPal',
      items: [
        { id: 'p2', name: 'Sony WH-1000XM5 Headphones', price: 348, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200', quantity: 2 }
      ],
    },
    {
      id: 'ORD-100003',
      customer: 'Ali Hassan',
      email: 'ali@example.com',
      phone: '+92 300-1234567',
      address: '789 Garden Road',
      city: 'Karachi',
      postalCode: '74000',
      date: today,
      total: '$329.00',
      status: 'Shipped',
      paymentMethod: 'Cash on Delivery',
      items: [
        { id: 'p4', name: 'Samsung Galaxy Watch 6', price: 329, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200', quantity: 1 }
      ],
    },
    {
      id: 'ORD-100004',
      customer: 'Maria Khan',
      email: 'maria@example.com',
      phone: '+92 321-9876543',
      address: '22 Blue Area',
      city: 'Islamabad',
      postalCode: '44000',
      date: today,
      total: '$999.00',
      status: 'Pending',
      paymentMethod: 'Credit Card',
      items: [
        { id: 'p3', name: 'MacBook Air M2', price: 999, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200', quantity: 1 }
      ],
    },
    {
      id: 'ORD-100005',
      customer: 'Ahmed Raza',
      email: 'ahmed@example.com',
      phone: '+92 333-4567890',
      address: '10 Mall Road',
      city: 'Lahore',
      postalCode: '54000',
      date: today,
      total: '$348.00',
      status: 'Cancelled',
      paymentMethod: 'Cash on Delivery',
      items: [
        { id: 'p2', name: 'Sony WH-1000XM5 Headphones', price: 348, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200', quantity: 1 }
      ],
    },
  ],
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.items.unshift(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: OrderStatus }>) => {
      const order = state.items.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      const order = state.items.find(o => o.id === action.payload);
      if (order) {
        order.status = 'Cancelled';
      }
    },
  },
});

export const { addOrder, updateOrderStatus, cancelOrder } = orderSlice.actions;
export default orderSlice.reducer;
