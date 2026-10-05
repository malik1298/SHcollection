import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useSettings } from '../../context/SettingsContext.js';
import { generateOrderSlipPDF } from '../../lib/pdf.js';
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  FileText,
  X
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { settings, formatPrice } = useSettings();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(id, newStatus);
      if (updated) {
        setOrders(orders.map((o) => (o.id === id ? updated : o)));
        if (selectedOrder?.id === id) {
          setSelectedOrder(updated);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: string, orderNumber: string) => {
    if (!window.confirm(`Permanently remove order ${orderNumber}?`)) return;
    try {
      await api.deleteOrder(id);
      setOrders(orders.filter((o) => o.id !== id));
      if (selectedOrder?.id === id) setSelectedOrder(null);
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  const handleDownloadSlip = (order: Order) => {
    generateOrderSlipPDF(order, settings);
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        (o.email && o.email.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-purple-100 text-purple-800';
      case 'Shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  const statuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-[#E8DFC9] shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client name, telephone, order #..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
            />
            <Search className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none"
          >
            <option value="all">All Statuses ({orders.length})</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st} ({orders.filter((o) => o.status === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFC9] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#2A1215] text-[#F4E8C1]">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Client Name & Phone</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Items</th>
                <th className="p-4 text-right">Total Payable</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFEB]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#8C7654]">
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#722F37]">
                      {o.orderNumber}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-[#231F20]">{o.customerName}</div>
                      <span className="text-[11px] text-[#8C7654]">{o.phone}</span>
                    </td>

                    <td className="p-4 text-[#5A5550]">
                      {new Date(o.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="p-4 text-center font-bold text-[#231F20]">
                      {o.items.length}
                    </td>

                    <td className="p-4 text-right font-serif-luxury font-bold text-[#722F37]">
                      {formatPrice(o.grandTotal)}
                    </td>

                    <td className="p-4 text-center">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border-none cursor-pointer ${getStatusBadge(
                          o.status
                        )}`}
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 rounded-lg text-[#722F37] hover:bg-[#F5EFEB]"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDownloadSlip(o)}
                          className="p-1.5 rounded-lg text-[#8C7654] hover:bg-[#F5EFEB]"
                          title="Download Order Slip PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(o.id, o.orderNumber)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] border-2 border-[#D4AF37] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC9]">
              <div>
                <span className="text-[10px] text-[#8C7654] uppercase tracking-wider font-semibold block">
                  Bridal Order Dossier
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-[#722F37]">
                  Order #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client info & status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#E8DFC9] space-y-1">
                <span className="font-bold text-[#722F37] block">Client Contact:</span>
                <p className="font-semibold text-[#231F20]">{selectedOrder.customerName}</p>
                <p>Tel: {selectedOrder.phone}</p>
                {selectedOrder.email && <p>Email: {selectedOrder.email}</p>}
                <p>Address: {selectedOrder.address}, {selectedOrder.city} {selectedOrder.province}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E8DFC9] space-y-1">
                <span className="font-bold text-[#722F37] block">Order Status & Payment:</span>
                <p>Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p>Method: {selectedOrder.paymentMethod}</p>
                <div className="pt-1 flex items-center space-x-2">
                  <span>Status:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                    className="font-bold text-xs p-1 rounded border border-[#E8DFC9]"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#231F20] block">Ordered Ensembles:</span>
              <div className="divide-y divide-[#E8DFC9] border border-[#E8DFC9] rounded-xl overflow-hidden bg-white">
                {selectedOrder.items.map((it, i) => (
                  <div key={i} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={it.image || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=200&q=80'}
                        alt=""
                        className="w-12 h-14 object-cover rounded bg-[#F5EFEB]"
                      />
                      <div>
                        <h4 className="font-bold text-[#231F20]">{it.name}</h4>
                        <span className="text-[11px] text-[#8C7654]">
                          SKU: {it.sku} | Size: {it.size} | Color: {it.color} | Qty: {it.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-serif-luxury font-bold text-[#722F37]">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="p-3 bg-[#F5EFEB] rounded-xl text-xs space-y-1">
                <span className="font-bold text-[#722F37] block">Client Fitting / Event Notes:</span>
                <p className="text-[#5A5550]">{selectedOrder.notes}</p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#E8DFC9] flex justify-between items-center">
              <span className="font-serif-luxury text-lg font-bold text-[#722F37]">
                Total: {formatPrice(selectedOrder.grandTotal)}
              </span>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownloadSlip(selectedOrder)}
                  className="px-4 py-2 bg-[#722F37] text-[#F4E8C1] rounded-xl text-xs font-bold flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
