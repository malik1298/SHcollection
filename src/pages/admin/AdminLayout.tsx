import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ClipboardList,
  Percent,
  Settings,
  Image as ImageIcon,
  Sparkles,
  Coins,
  MessageCircle,
  FileText,
  KeyRound,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Store,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onViewStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onViewStore,
  children,
}) => {
  const { logout, adminUser } = useAuth();
  const { settings } = useSettings();

  // Desktop sidebar state: open by default on desktop, closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'sales', label: 'Sales Management', icon: Percent },
    { id: 'whatsapp', label: 'Contact & WhatsApp Settings', icon: MessageCircle },
    { id: 'settings', label: 'Website Settings', icon: Settings },
    { id: 'logo', label: 'Logo & Branding', icon: ImageIcon },
    { id: 'hero', label: 'Hero Image & Banner', icon: Sparkles },
    { id: 'currency', label: 'Currency System', icon: Coins },
    { id: 'order-slip', label: 'Order Slip Settings', icon: FileText },
    { id: 'account', label: 'Admin Account', icon: KeyRound },
  ];

  const handleSelectTab = (id: string) => {
    onTabChange(id);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFEB] flex flex-col relative overflow-x-hidden">
      {/* Universal Top Admin Bar (Mobile & Desktop) */}
      <header className="bg-[#2A1215] text-[#FDFBF7] border-b border-[#D4AF37]/30 sticky top-0 z-40 px-4 py-3 sm:px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* 3-Line Hamburger Menu Button (Toggle Sidebar on both Desktop & Mobile) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl text-[#F4E8C1] hover:bg-[#3D1A1F] hover:text-[#D4AF37] border border-[#D4AF37]/20 transition-all flex items-center justify-center active:scale-95 shadow-sm"
            title={isSidebarOpen ? 'Collapse Admin Menu' : 'Expand Admin Menu'}
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>

          <div className="flex items-center space-x-2">
            <span className="font-serif-luxury font-bold text-base sm:text-xl text-[#F4E8C1] tracking-wide">
              {settings.websiteName}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#722F37] text-[#D4AF37] border border-[#D4AF37]/40 hidden sm:inline-block">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onViewStore}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold bg-[#3D1A1F] hover:bg-[#501F25] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
            title="Open Live Boutique Store"
          >
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">View Boutique</span>
          </button>

          <button
            onClick={logout}
            className="p-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-[#722F37]/50 hover:bg-[#722F37] text-[#F4E8C1] border border-[#722F37] flex items-center space-x-1.5 transition-all active:scale-95"
            title="Sign out of Admin Panel"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Backdrop for Mobile Screen when Sidebar is open */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar backdrop"
        />
      )}

      {/* Main Admin Body: Sidebar + Content */}
      <div className="flex-1 flex flex-row relative min-h-[calc(100vh-61px)]">
        {/* Slide-in / Collapsible Sidebar */}
        <aside
          className={`fixed lg:sticky top-[61px] inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#2A1215] text-[#F9F6F0] flex flex-col justify-between border-r border-[#D4AF37]/30 transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none h-[calc(100vh-61px)] ${
            isSidebarOpen
              ? 'translate-x-0 opacity-100'
              : '-translate-x-full lg:-ml-72 opacity-0 pointer-events-none'
          }`}
        >
          {/* Top of Sidebar */}
          <div className="flex flex-col flex-1 min-h-0">
            {/* Header info inside sidebar */}
            <div className="p-4 border-b border-[#3D1A1F] flex items-center justify-between bg-[#220D10]/60">
              <div>
                <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold block">
                  Management Navigation
                </span>
                <span className="text-xs text-[#E8DFC9]">
                  {navigationItems.length} Control Sections
                </span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-[#F4E8C1] hover:bg-[#3D1A1F]"
                aria-label="Close admin menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vertically Scrollable Nav Items with Clean Modern Scrollbar */}
            <nav className="flex-1 overflow-y-auto admin-sidebar-scroll p-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all group ${
                      isActive
                        ? 'bg-[#722F37] text-[#F4E8C1] shadow-md border-l-4 border-[#D4AF37]'
                        : 'text-[#E8DFC9] hover:bg-[#3D1A1F] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-[#D4AF37]' : 'text-[#8C7654] group-hover:text-[#D4AF37]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Administrator Profile card in Sidebar */}
          <div className="p-4 border-t border-[#3D1A1F] space-y-2 bg-[#220D10] shrink-0">
            <div className="px-2 py-1 text-xs">
              <span className="text-[10px] text-[#8C7654] uppercase tracking-wider block font-semibold">
                Administrator
              </span>
              <span className="font-bold text-[#F4E8C1] truncate block text-xs">
                {adminUser?.name || 'SH Collection Master'}
              </span>
              <span className="text-[10px] text-[#A89F91] truncate block font-mono">
                {adminUser?.email || 'shcollection@gmail.com'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onViewStore}
                className="py-2 px-2.5 rounded-lg text-xs font-semibold bg-[#3D1A1F] hover:bg-[#501F25] text-[#D4AF37] flex items-center justify-center space-x-1 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Store</span>
              </button>

              <button
                onClick={logout}
                className="py-2 px-2.5 rounded-lg text-xs font-semibold bg-[#722F37]/40 hover:bg-[#722F37] text-[#F4E8C1] flex items-center justify-center space-x-1 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Breadcrumb / Section Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8DFC9]">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8C7654] font-semibold">
                Atelier Management Console
              </span>
              <h1 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#231F20] capitalize">
                {currentTab.replace(/-/g, ' ')}
              </h1>
            </div>

            <div className="text-xs text-[#8C7654] font-medium hidden md:block">
              Live Synchronized Settings
            </div>
          </div>

          {/* Active Tab Component */}
          {children}
        </main>
      </div>
    </div>
  );
};
