"use client";

import { use, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateShipmentStatus, addTrackingEvent, ShipmentStatus } from '@/store/shippingSlice';
import Link from 'next/link';
import { ArrowLeft, MapPin, Package, Truck, CheckCircle } from 'lucide-react';

const statusStyles: Record<ShipmentStatus, string> = {
  'Pending':          'bg-gray-100 text-gray-600 border-gray-200',
  'Picked Up':        'bg-blue-100 text-blue-700 border-blue-200',
  'In Transit':       'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Out for Delivery': 'bg-orange-100 text-orange-700 border-orange-200',
  'Delivered':        'bg-green-100 text-green-700 border-green-200',
  'Failed':           'bg-red-100 text-red-700 border-red-200',
};

const allStatuses: ShipmentStatus[] = ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed'];
const progressOrder: ShipmentStatus[] = ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];

export default function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const { shipments } = useAppSelector(state => state.shipping);
  const shipment = shipments.find(s => s.id === id);

  const [newEvent, setNewEvent] = useState({ location: '', description: '' });
  const [showEventForm, setShowEventForm] = useState(false);

  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Package size={60} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Shipment Not Found</h2>
        <Link href="/admin/shipping" className="text-orange-500 hover:underline">Back to Shipping</Link>
      </div>
    );
  }

  const currentStep = progressOrder.indexOf(shipment.status);

  const handleAddEvent = () => {
    if (!newEvent.location || !newEvent.description) return;
    dispatch(addTrackingEvent({
      shipmentId: shipment.id,
      event: {
        timestamp: new Date().toLocaleString(),
        location: newEvent.location,
        description: newEvent.description,
      }
    }));
    setNewEvent({ location: '', description: '' });
    setShowEventForm(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/shipping" className="text-gray-400 hover:text-gray-600 transition-colors"><ArrowLeft size={20} /></Link>
        <h2 className="text-2xl font-bold text-gray-800">Shipment {shipment.id}</h2>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Order: <Link href={`/admin/orders/${shipment.orderId}`} className="text-orange-500 font-semibold hover:underline">{shipment.orderId}</Link></p>
          <p className="text-sm text-gray-500">Created: {shipment.createdAt}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`px-4 py-2 rounded-full text-sm font-bold border ${statusStyles[shipment.status]}`}>
            {shipment.status}
          </span>
          {/* Quick next status */}
          {shipment.status !== 'Delivered' && shipment.status !== 'Failed' && (
            <button
              onClick={() => {
                const nextIdx = progressOrder.indexOf(shipment.status) + 1;
                if (nextIdx < progressOrder.length) {
                  dispatch(updateShipmentStatus({ id: shipment.id, status: progressOrder[nextIdx], location: shipment.city }));
                }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
              <Truck size={16} /> Move to Next Stage
            </button>
          )}
        </div>
      </div>

      {/* Progress Tracker */}
      {shipment.status !== 'Failed' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-6">Shipment Progress</h3>
          <div className="flex items-center overflow-x-auto pb-2">
            {progressOrder.map((step, i) => (
              <div key={step} className="flex items-center flex-1 min-w-[80px]">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all flex-shrink-0 ${
                    i <= currentStep ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-2 font-medium text-center ${i <= currentStep ? 'text-orange-600' : 'text-gray-400'}`}>
                    {step}
                  </span>
                </div>
                {i < progressOrder.length - 1 && (
                  <div className={`flex-1 h-1 mb-5 rounded-full mx-1 ${i < currentStep ? 'bg-orange-400' : 'bg-gray-100'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Status */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">Update Status Manually</h3>
        <div className="flex flex-wrap gap-2">
          {allStatuses.map(s => (
            <button key={s}
              onClick={() => dispatch(updateShipmentStatus({ id: shipment.id, status: s, location: shipment.city }))}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                shipment.status === s ? statusStyles[s] : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tracking Events */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800">Tracking History</h3>
            <button onClick={() => setShowEventForm(!showEventForm)}
              className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors">
              + Add Event
            </button>
          </div>

          {showEventForm && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-5 space-y-3">
              <input value={newEvent.location} onChange={e => setNewEvent(p => ({ ...p, location: e.target.value }))}
                placeholder="Location (e.g. Lahore Hub, PK)"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
              <input value={newEvent.description} onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))}
                placeholder="Description (e.g. Arrived at sorting facility)"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
              <div className="flex gap-2">
                <button onClick={handleAddEvent} className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors flex items-center gap-1">
                  <CheckCircle size={14} /> Add
                </button>
                <button onClick={() => setShowEventForm(false)} className="text-gray-500 hover:text-gray-700 text-sm px-3">Cancel</button>
              </div>
            </div>
          )}

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />
            <div className="space-y-4">
              {shipment.events.map((event, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center z-10 text-xs font-bold ${
                    i === 0 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{i === 0 ? '●' : '○'}</div>
                  <div className="flex-1 pb-4">
                    <p className={`font-semibold text-sm ${i === 0 ? 'text-orange-600' : 'text-gray-800'}`}>{event.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{event.location} · {event.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipment Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Package size={16} className="text-orange-500" /> Package Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Carrier</span><span className="font-semibold">{shipment.carrier}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tracking #</span><span className="font-mono text-xs">{shipment.trackingNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Weight</span><span>{shipment.weight}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Dimensions</span><span>{shipment.dimensions}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Est. Delivery</span><span className="font-semibold text-orange-600">{shipment.estimatedDelivery}</span></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><MapPin size={16} className="text-orange-500" /> Deliver To</h3>
            <p className="font-semibold text-gray-800">{shipment.customer}</p>
            <p className="text-sm text-gray-500 mt-1">{shipment.address}</p>
            <p className="text-sm text-gray-500">{shipment.city}, {shipment.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
