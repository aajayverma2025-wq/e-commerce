import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';
export type PaymentMethod = 'Credit Card' | 'PayPal' | 'Cash on Delivery';

export interface Transaction {
  id: string;
  orderId: string;
  customer: string;
  email: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  gatewayRef: string;
}

export interface RefundRequest {
  id: string;
  orderId: string;
  transactionId: string;
  customer: string;
  amount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

interface PaymentState {
  transactions: Transaction[];
  refundRequests: RefundRequest[];
  gatewaySettings: {
    stripeEnabled: boolean;
    stripePublicKey: string;
    paypalEnabled: boolean;
    paypalClientId: string;
    codEnabled: boolean;
    taxRate: number;
    currency: string;
  };
}

const today = new Date().toISOString().split('T')[0];

const initialState: PaymentState = {
  transactions: [
    { id: 'TXN-001', orderId: 'ORD-100001', customer: 'John Doe', email: 'john@example.com', amount: 1199, method: 'Credit Card', status: 'Paid', date: today, gatewayRef: 'ch_3P1abc123' },
    { id: 'TXN-002', orderId: 'ORD-100002', customer: 'Sarah Ahmed', email: 'sarah@example.com', amount: 696, method: 'PayPal', status: 'Paid', date: today, gatewayRef: 'PAYID-789xyz' },
    { id: 'TXN-003', orderId: 'ORD-100003', customer: 'Ali Hassan', email: 'ali@example.com', amount: 329, method: 'Cash on Delivery', status: 'Pending', date: today, gatewayRef: 'COD-003' },
    { id: 'TXN-004', orderId: 'ORD-100004', customer: 'Maria Khan', email: 'maria@example.com', amount: 999, method: 'Credit Card', status: 'Paid', date: today, gatewayRef: 'ch_3P2def456' },
    { id: 'TXN-005', orderId: 'ORD-100005', customer: 'Ahmed Raza', email: 'ahmed@example.com', amount: 348, method: 'Cash on Delivery', status: 'Refunded', date: today, gatewayRef: 'COD-005' },
  ],
  refundRequests: [
    { id: 'REF-001', orderId: 'ORD-100005', transactionId: 'TXN-005', customer: 'Ahmed Raza', amount: 348, reason: 'Item not as described', status: 'Approved', date: today },
    { id: 'REF-002', orderId: 'ORD-100002', transactionId: 'TXN-002', customer: 'Sarah Ahmed', amount: 348, reason: 'Changed my mind', status: 'Pending', date: today },
  ],
  gatewaySettings: {
    stripeEnabled: true,
    stripePublicKey: 'pk_test_12345',
    paypalEnabled: true,
    paypalClientId: '',
    codEnabled: true,
    taxRate: 5,
    currency: 'USD',
  },
};

export const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    updateTransactionStatus: (state, action: PayloadAction<{ id: string; status: PaymentStatus }>) => {
      const txn = state.transactions.find(t => t.id === action.payload.id);
      if (txn) txn.status = action.payload.status;
    },
    addRefundRequest: (state, action: PayloadAction<RefundRequest>) => {
      state.refundRequests.unshift(action.payload);
    },
    updateRefundStatus: (state, action: PayloadAction<{ id: string; status: 'Approved' | 'Rejected' }>) => {
      const ref = state.refundRequests.find(r => r.id === action.payload.id);
      if (ref) {
        ref.status = action.payload.status;
        // If approved, mark transaction as refunded
        if (action.payload.status === 'Approved') {
          const txn = state.transactions.find(t => t.id === ref.transactionId);
          if (txn) txn.status = 'Refunded';
        }
      }
    },
    updateGatewaySettings: (state, action: PayloadAction<PaymentState['gatewaySettings']>) => {
      state.gatewaySettings = action.payload;
    },
  },
});

export const { addTransaction, updateTransactionStatus, addRefundRequest, updateRefundStatus, updateGatewaySettings } = paymentSlice.actions;
export default paymentSlice.reducer;
