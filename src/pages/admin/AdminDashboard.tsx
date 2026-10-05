import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useSettings } from '../../context/SettingsContext.js';
import { Order, Product } from '../../types/index.js';
import {
  ShoppingBag,
  ClipboardList,
  Flame,
  CheckCircle,
  Clock,
  Coins,
  ArrowUpRight,
  Plus,
  Eye,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenAddProduct: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenAddProduct,
}) => {
  const { formatPrice } = useSettings();
  const [stats, setStats] = useState<{
    totalProducts: number;
    activeProducts: number;
    saleProducts: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalSales: number;
    recentOrders: Order[];
    recentProducts: Product[];
  }>({
    totalProducts: 0,
    activeProducts: 0,
    saleProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSales: 0,
    recentOrders: [],
    recentProducts: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getStats()
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      title: 'Total Gross Sales',
      value: formatPrice(stats.totalSales),
      sub: `${stats.totalOrders} total orders recorded`,
      icon: Coins,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      sub: 'Awaiting atelier confirmation',
      icon: Clock,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      sub: 'Successfully delivered',
      icon: CheckCircle,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Active Catalog',
      value: `${stats.activeProducts} / ${stats.totalProducts}`,
      sub: `${stats.saleProducts} on active promotion`,
      icon: ShoppingBag,
      color: 'bg-[#722F37]/10 text-[#722F37] border-[#722F37]/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-[#722F37] via-[#501F25] to-[#3D141A] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-[#D4AF37]">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#D4AF37] text-[#231F20] text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Atelier Overview</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#FDFBF7]">
            Welcome to SH Collection Executive Suite
          </h2>
          <p className="text-xs text-[#E8DFC9] max-w-xl">
            Live synchronization active. Products, orders, branding assets, currency, and WhatsApp numbers update instantly on the customer storefront.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenAddProduct}
            className="px-5 py-3 bg-[#F4E8C1] hover:bg-white text-[#722F37] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-[#F4E8C1] border border-[#F4E8C1]/30 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5"
          >
            <span>Manage Orders</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E8DFC9] p-6 shadow-sm flex items-start justify-between"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#8C7654] uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#231F20]">
                  {card.value}
                </div>
                <p className="text-[11px] text-[#5A5550]">{card.sub}</p>
              </div>
              <div className={`p-3 rounded-2xl border ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 Column Section: Recent Orders & Catalog Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DFC9] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC9]">
            <h3 className="font-serif-luxury text-lg font-bold text-[#231F20]">
              Recent Bridal Bookings
            </h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-[#722F37] hover:underline flex items-center space-x-1"
            >
              <span>View All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="text-xs text-[#8C7654] py-8 text-center">
              No orders recorded yet. Place an order on the storefront to test.
            </p>
          ) : (
            <div className="divide-y divide-[#F5EFEB]">
              {stats.recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => onNavigateTab('orders')}
                  className="py-3 flex items-center justify-between hover:bg-[#FDFBF7] px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#722F37]">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs font-bold text-[#231F20]">
                        {ord.customerName}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8C7654]">
                      {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'} • {ord.city}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-serif-luxury font-bold text-xs text-[#231F20] block">
                      {formatPrice(ord.grandTotal)}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : ord.status === 'Confirmed'
                          ? 'bg-blue-100 text-blue-700'
                          : ord.status === 'Processing'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Products (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8DFC9] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC9]">
            <h3 className="font-serif-luxury text-lg font-bold text-[#231F20]">
              Recent Catalog Additions
            </h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-semibold text-[#722F37] hover:underline flex items-center space-x-1"
            >
              <span>Manage Catalog</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.recentProducts.length === 0 ? (
            <p className="text-xs text-[#8C7654] py-8 text-center">
              No products found.
            </p>
          ) : (
            <div className="divide-y divide-[#F5EFEB]">
              {stats.recentProducts.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center space-x-3">
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=200&q=80'}
                    alt=""
                    className="w-12 h-14 object-cover object-top rounded-lg bg-[#F5EFEB] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif-luxury text-xs font-bold text-[#231F20] truncate">
                      {p.name}
                    </h4>
                    <span className="text-[10px] text-[#8C7654] uppercase block">
                      SKU: {p.sku} • Stock: {p.stock}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif-luxury text-xs font-bold text-[#722F37] block">
                      {formatPrice(p.saleEnabled ? p.salePrice : p.price)}
                    </span>
                    {p.saleEnabled && (
                      <span className="text-[9px] text-[#25D366] font-bold">
                        {p.salePercentage}% OFF
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
