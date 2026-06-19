import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ShipmentStatus = 'Pending' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Failed';

export interface TrackingEvent {
  timestamp: string;
  location: string;
  description: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  city: string;
  country: string;
  carrier: string;
  trackingNumber: string;
  status: ShipmentStatus;
  estimatedDelivery: string;
  weight: string;
  dimensions: string;
  createdAt: string;
  events: TrackingEvent[];
}

export interface Carrier {
  id: string;
  name: string;
  logo: string;
  isActive: boolean;
  trackingUrl: string;
  avgDeliveryDays: string;
  costPerKg: number;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  standardRate: number;
  expressRate: number;
  freeShippingThreshold: number;
  isActive: boolean;
}

interface ShippingState {
  shipments: Shipment[];
  carriers: Carrier[];
  zones: ShippingZone[];
}

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

const initialState: ShippingState = {
  shipments: [
    {
      id: 'SHP-001',
      orderId: 'ORD-100001',
      customer: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      country: 'United States',
      carrier: 'FedEx',
      trackingNumber: 'FX789456123',
      status: 'Delivered',
      estimatedDelivery: today,
      weight: '0.8 kg',
      dimensions: '25×15×8 cm',
      createdAt: yesterday,
      events: [
        { timestamp: `${today} 14:30`, location: 'New York, NY', description: 'Package delivered to recipient.' },
        { timestamp: `${today} 08:15`, location: 'New York, NY', description: 'Out for delivery.' },
        { timestamp: `${yesterday} 22:00`, location: 'Newark Hub, NJ', description: 'Arrived at delivery facility.' },
        { timestamp: `${yesterday} 10:00`, location: 'Chicago, IL', description: 'In transit to destination.' },
      ],
    },
    {
      id: 'SHP-002',
      orderId: 'ORD-100002',
      customer: 'Sarah Ahmed',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      country: 'United States',
      carrier: 'UPS',
      trackingNumber: 'UP123456789',
      status: 'Out for Delivery',
      estimatedDelivery: today,
      weight: '1.2 kg',
      dimensions: '30×20×10 cm',
      createdAt: yesterday,
      events: [
        { timestamp: `${today} 09:00`, location: 'Los Angeles, CA', description: 'Out for delivery with driver.' },
        { timestamp: `${yesterday} 23:30`, location: 'LA Hub, CA', description: 'Arrived at local facility.' },
        { timestamp: `${yesterday} 12:00`, location: 'Phoenix, AZ', description: 'In transit.' },
      ],
    },
    {
      id: 'SHP-003',
      orderId: 'ORD-100003',
      customer: 'Ali Hassan',
      address: '789 Garden Road',
      city: 'Karachi',
      country: 'Pakistan',
      carrier: 'DHL',
      trackingNumber: 'DH456789012',
      status: 'In Transit',
      estimatedDelivery: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      weight: '0.5 kg',
      dimensions: '20×15×5 cm',
      createdAt: yesterday,
      events: [
        { timestamp: `${yesterday} 18:00`, location: 'Dubai Hub', description: 'In transit via air cargo.' },
        { timestamp: `${yesterday} 06:00`, location: 'Warehouse', description: 'Package picked up by carrier.' },
      ],
    },
    {
      id: 'SHP-004',
      orderId: 'ORD-100004',
      customer: 'Maria Khan',
      address: '22 Blue Area',
      city: 'Islamabad',
      country: 'Pakistan',
      carrier: 'TCS',
      trackingNumber: 'TCS789012345',
      status: 'Picked Up',
      estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      weight: '2.1 kg',
      dimensions: '40×30×15 cm',
      createdAt: today,
      events: [
        { timestamp: `${today} 11:00`, location: 'Warehouse, Islamabad', description: 'Package picked up by TCS.' },
      ],
    },
    {
      id: 'SHP-005',
      orderId: 'ORD-100005',
      customer: 'Ahmed Raza',
      address: '10 Mall Road',
      city: 'Lahore',
      country: 'Pakistan',
      carrier: 'FedEx',
      trackingNumber: 'FX321654987',
      status: 'Failed',
      estimatedDelivery: yesterday,
      weight: '0.9 kg',
      dimensions: '25×20×10 cm',
      createdAt: yesterday,
      events: [
        { timestamp: `${yesterday} 15:00`, location: 'Lahore, PK', description: 'Delivery failed — address not found. Returning to sender.' },
        { timestamp: `${yesterday} 08:00`, location: 'Lahore Hub, PK', description: 'Out for delivery.' },
      ],
    },
  ],
  carriers: [
    { id: 'c1', name: 'FedEx', logo: '📦', isActive: true, trackingUrl: 'https://fedex.com/tracking', avgDeliveryDays: '1–3 days', costPerKg: 8.5 },
    { id: 'c2', name: 'UPS', logo: '🟤', isActive: true, trackingUrl: 'https://ups.com/track', avgDeliveryDays: '2–5 days', costPerKg: 7.2 },
    { id: 'c3', name: 'DHL', logo: '🟡', isActive: true, trackingUrl: 'https://dhl.com/track', avgDeliveryDays: '3–7 days', costPerKg: 9.0 },
    { id: 'c4', name: 'TCS', logo: '🔴', isActive: true, trackingUrl: 'https://tcs.com.pk/track', avgDeliveryDays: '1–2 days', costPerKg: 2.5 },
    { id: 'c5', name: 'Leopards', logo: '🐆', isActive: false, trackingUrl: 'https://leopardscourier.com/track', avgDeliveryDays: '1–3 days', costPerKg: 2.0 },
  ],
  zones: [
    { id: 'z1', name: 'Domestic (Pakistan)', countries: ['Pakistan'], standardRate: 3, expressRate: 8, freeShippingThreshold: 50, isActive: true },
    { id: 'z2', name: 'North America', countries: ['United States', 'Canada'], standardRate: 15, expressRate: 35, freeShippingThreshold: 150, isActive: true },
    { id: 'z3', name: 'Europe', countries: ['UK', 'Germany', 'France', 'Italy'], standardRate: 20, expressRate: 45, freeShippingThreshold: 200, isActive: true },
    { id: 'z4', name: 'Middle East', countries: ['UAE', 'Saudi Arabia', 'Qatar'], standardRate: 10, expressRate: 25, freeShippingThreshold: 100, isActive: true },
  ],
};

export const shippingSlice = createSlice({
  name: 'shipping',
  initialState,
  reducers: {
    updateShipmentStatus: (state, action: PayloadAction<{ id: string; status: ShipmentStatus; location: string }>) => {
      const shipment = state.shipments.find(s => s.id === action.payload.id);
      if (shipment) {
        shipment.status = action.payload.status;
        shipment.events.unshift({
          timestamp: new Date().toLocaleString(),
          location: action.payload.location,
          description: `Status updated to: ${action.payload.status}`,
        });
      }
    },
    addTrackingEvent: (state, action: PayloadAction<{ shipmentId: string; event: TrackingEvent }>) => {
      const shipment = state.shipments.find(s => s.id === action.payload.shipmentId);
      if (shipment) {
        shipment.events.unshift(action.payload.event);
      }
    },
    updateCarrier: (state, action: PayloadAction<Carrier>) => {
      const idx = state.carriers.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) state.carriers[idx] = action.payload;
    },
    addCarrier: (state, action: PayloadAction<Carrier>) => {
      state.carriers.push(action.payload);
    },
    toggleCarrier: (state, action: PayloadAction<string>) => {
      const carrier = state.carriers.find(c => c.id === action.payload);
      if (carrier) carrier.isActive = !carrier.isActive;
    },
    updateZone: (state, action: PayloadAction<ShippingZone>) => {
      const idx = state.zones.findIndex(z => z.id === action.payload.id);
      if (idx !== -1) state.zones[idx] = action.payload;
    },
    addZone: (state, action: PayloadAction<ShippingZone>) => {
      state.zones.push(action.payload);
    },
    toggleZone: (state, action: PayloadAction<string>) => {
      const zone = state.zones.find(z => z.id === action.payload);
      if (zone) zone.isActive = !zone.isActive;
    },
  },
});

export const {
  updateShipmentStatus, addTrackingEvent,
  updateCarrier, addCarrier, toggleCarrier,
  updateZone, addZone, toggleZone,
} = shippingSlice.actions;
export default shippingSlice.reducer;
