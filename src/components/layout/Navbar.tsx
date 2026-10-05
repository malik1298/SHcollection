import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { useCustomerAuth } from '../../context/CustomerAuthContext.js';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  User,
  Sparkles,
  Phone,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { settings, formatPrice } = useSettings();
  const { cartCount, grandTotal, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { openLoginModal, isLoggedIn, customer } = useCustomerAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('search', { query: searchQuery.trim() });
      setIsSearchOpen(false);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Bridal & Formals', id: 'products' },
    { name: 'Sale', id: 'sale', badge: 'Special Offer' },
    { name: 'Contact Atelier', id: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8DFC9] transition-all">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#722F37] text-[#F4E8C1] text-xs py-2 px-4 text-center font-medium tracking-widest flex items-center justify-center relative">
        <div className="hidden lg:flex items-center space-x-1.5 text-[11px] absolute left-6 font-semibold">
          <Phone className="w-3 h-3 text-[#D4AF37]" />
          <a
            href={`tel:${(settings.phone || '').replace(/[^0-9+]/g, '')}`}
            className="hover:text-white transition-colors"
            title="Call Atelier Helpline"
          >
            {settings.phone}
          </a>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          <span className="text-[10px] sm:text-xs">COMPLIMENTARY WHITE-GLOVE BRIDAL COURIER WORLDWIDE | BESPOKE ATELIER FITTINGS</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-[#722F37] hover:bg-[#F5EFEB] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
            <button
              onClick={() => onNavigate('home')}
              className="group flex flex-col items-center lg:items-start text-left focus:outline-none"
            >
              {settings.logoImage && settings.logoImage.trim() ? (
                <img
                  src={settings.logoImage}
                  alt={settings.websiteName}
                  className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider text-[#722F37] group-hover:text-[#501F25] transition-colors">
                      {settings.websiteName || 'SH Collection'}
                    </span>
                    <span className="text-[#D4AF37] text-xl font-serif">✦</span>
                  </div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#8C7654] font-medium mt-0.5">
                    Haute Couture & Bridals
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative py-2 text-sm font-medium tracking-wider uppercase transition-colors flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-[#722F37] font-semibold'
                      : 'text-[#5A5550] hover:text-[#722F37]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="bg-[#722F37] text-[#F4E8C1] text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full tracking-normal">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#5A5550] hover:text-[#722F37] hover:bg-[#F5EFEB] rounded-full transition-colors relative"
              title="Search Bridal Collection"
              aria-label="Search dresses"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={() => onNavigate('products', { wishlistOnly: true })}
              className="p-2 text-[#5A5550] hover:text-[#722F37] hover:bg-[#F5EFEB] rounded-full transition-colors relative"
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-2 py-1.5 px-3 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] rounded-full transition-all shadow-sm hover:shadow active:scale-95"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#F4E8C1]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#231F20] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-xs font-semibold tracking-wider">
                {cartCount > 0 ? formatPrice(grandTotal) : 'Bag'}
              </span>
            </button>

            {/* Customer Account / Login Button */}
            <button
              onClick={openLoginModal}
              className="p-2 text-[#5A5550] hover:text-[#722F37] hover:bg-[#F5EFEB] rounded-full transition-colors relative"
              title={isLoggedIn ? `Account (${customer?.name})` : 'Client Account / Sign In'}
              aria-label="Client Account"
            >
              <User className="w-5 h-5" />
              {isLoggedIn && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#25D366] ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Luxury Search Modal / Bar */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
          <div className="bg-[#FDFBF7] border border-[#D4AF37]/50 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#722F37] hover:bg-[#F5EFEB] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-4">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Haute Couture Discovery
              </span>
              <h3 className="font-serif-luxury text-2xl text-[#722F37] font-bold">
                Search SH Collection
              </h3>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by dress name, bridal SKU, fabric or category (e.g. Lehnga, Velvet, Gharara)..."
                className="w-full pl-12 pr-28 py-3.5 bg-white border border-[#E8DFC9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37] text-[#231F20]"
                autoFocus
              />
              <Search className="w-5 h-5 text-[#8C7654] absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#722F37] text-[#F4E8C1] text-xs font-semibold rounded-lg hover:bg-[#501F25] transition-colors"
              >
                Search
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-[#E8DFC9] flex flex-wrap items-center gap-2 text-xs text-[#5A5550]">
              <span className="font-semibold text-[#722F37]">Popular Inquiries:</span>
              {['Barat Lehnga', 'Walima Gown', 'Velvet Gharara', 'Pishwas', 'Crimson Red'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    onNavigate('search', { query: tag });
                    setIsSearchOpen(false);
                  }}
                  className="px-2.5 py-1 bg-[#F5EFEB] hover:bg-[#722F37] hover:text-[#F4E8C1] rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Full-Screen Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[9999] w-screen h-screen overflow-hidden bg-[#FDFBF7] animate-in fade-in slide-in-from-left duration-300"
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999 }}
        >
          <div className="w-full h-full bg-[#FDFBF7] p-6 flex flex-col justify-between overflow-y-auto overflow-x-hidden">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E8DFC9]">
                <div>
                  <span className="font-serif-luxury text-2xl font-bold text-[#722F37]">
                    {settings.websiteName}
                  </span>
                  <p className="text-[10px] tracking-widest text-[#8C7654] uppercase">
                    Haute Couture Ateliers
                  </p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#722F37] hover:bg-[#F5EFEB] rounded-full transition-colors active:scale-95"
                  aria-label="Close mobile menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mt-6 mb-4 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bridal dresses..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E8DFC9] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
                <Search className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
              </form>

              {/* Mobile Links */}
              <nav className="space-y-1.5 mt-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      onNavigate(link.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium tracking-wide uppercase transition-colors ${
                      currentPage === link.id
                        ? 'bg-[#722F37] text-[#F4E8C1]'
                        : 'text-[#231F20] hover:bg-[#F5EFEB]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="bg-[#D4AF37] text-[#231F20] text-[10px] font-bold px-2 py-0.5 rounded-full lowercase tracking-normal">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </button>
                ))}
              </nav>
            </div>

            {/* Mobile Footer Area */}
            <div className="pt-6 border-t border-[#E8DFC9] space-y-3 mt-6">
              {/* Account Link */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openLoginModal();
                }}
                className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#231F20] bg-white border border-[#E8DFC9] rounded-xl flex items-center justify-between transition-colors shadow-sm hover:border-[#722F37]"
              >
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#722F37]" />
                  <span>{isLoggedIn ? `Account (${customer?.name})` : `Account (${settings.websiteName})`}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8C7654]" />
              </button>

              <div className="flex items-center space-x-2 text-xs text-[#5A5550]">
                <Phone className="w-3.5 h-3.5 text-[#722F37]" />
                <a
                  href={`tel:${(settings.phone || '').replace(/[^0-9+]/g, '')}`}
                  className="hover:text-[#722F37] transition-colors"
                >
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
