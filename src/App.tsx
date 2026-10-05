import React, { useState, useEffect } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext.js';
import { CartProvider } from './context/CartContext.js';
import { WishlistProvider } from './context/WishlistContext.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { CustomerAuthProvider } from './context/CustomerAuthContext.js';

import { Product, Order, Category } from './types/index.js';
import { api } from './lib/api.js';

import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { CartDrawer } from './components/cart/CartDrawer.js';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp.js';
import { CustomerLoginModal } from './components/auth/CustomerLoginModal.js';

// Customer Pages
import { HomePage } from './pages/customer/HomePage.js';
import { ProductsPage } from './pages/customer/ProductsPage.js';
import { SalePage } from './pages/customer/SalePage.js';
import { ProductDetailPage } from './pages/customer/ProductDetailPage.js';
import { CartPage } from './pages/customer/CartPage.js';
import { CheckoutPage } from './pages/customer/CheckoutPage.js';
import { ThankYouPage } from './pages/customer/ThankYouPage.js';
import { ContactPage } from './pages/customer/ContactPage.js';
import { SearchResultsPage } from './pages/customer/SearchResultsPage.js';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { AdminLayout } from './pages/admin/AdminLayout.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';
import { AdminProducts } from './pages/admin/AdminProducts.js';
import { AdminCategories } from './pages/admin/AdminCategories.js';
import { AdminOrders } from './pages/admin/AdminOrders.js';
import { AdminSales } from './pages/admin/AdminSales.js';
import { AdminSettings } from './pages/admin/AdminSettings.js';
import { AdminLogoBranding } from './pages/admin/AdminLogoBranding.js';
import { AdminHero } from './pages/admin/AdminHero.js';
import { AdminCurrency } from './pages/admin/AdminCurrency.js';
import { AdminWhatsAppContact } from './pages/admin/AdminWhatsAppContact.js';
import { AdminOrderSlipSettings } from './pages/admin/AdminOrderSlipSettings.js';
import { AdminAccount } from './pages/admin/AdminAccount.js';

function AppContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { settings } = useSettings();

  const [currentPage, setCurrentPage] = useState<string>('home');
  const [navParams, setNavParams] = useState<Record<string, any>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddProductOpenFromDash, setIsAddProductOpenFromDash] = useState(false);

  // Load categories globally for filters and admin
  const loadCategories = () => {
    api.getCategories().then(setCategories).catch(() => {});
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Sync state navigation with browser history
  const navigate = (page: string, params: Record<string, any> = {}) => {
    setNavParams(params);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Push state for browser back/forward buttons
    try {
      window.history.pushState({ page, params }, '', `#${page}`);
    } catch (e) {
      // safe fallback
    }
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.page) {
        setCurrentPage(e.state.page);
        setNavParams(e.state.params || {});
      } else {
        const hash = window.location.hash.replace('#', '');
        if (hash) setCurrentPage(hash);
        else setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    navigate('product-detail', { productId: product.id });
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    navigate('thank-you');
  };

  // Admin routing check: if requested admin panel but not authenticated, show Admin Login
  if (currentPage === 'admin-panel') {
    if (!isAuthenticated) {
      return (
        <AdminLoginPage
          onSuccess={() => {
            navigate('admin-panel');
          }}
          onBackToStore={() => navigate('home')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onTabChange={(tab) => {
          setAdminTab(tab);
          setIsAddProductOpenFromDash(false);
        }}
        onViewStore={() => navigate('home')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            onNavigateTab={(tab) => setAdminTab(tab)}
            onOpenAddProduct={() => {
              setAdminTab('products');
              setIsAddProductOpenFromDash(true);
            }}
          />
        )}
        {adminTab === 'products' && (
          <AdminProducts
            categories={categories}
            isAddModalOpen={isAddProductOpenFromDash}
            onCloseAddModal={() => setIsAddProductOpenFromDash(false)}
          />
        )}
        {adminTab === 'categories' && (
          <AdminCategories
            categories={categories}
            onRefreshCategories={loadCategories}
          />
        )}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'sales' && <AdminSales />}
        {adminTab === 'settings' && <AdminSettings />}
        {adminTab === 'logo' && <AdminLogoBranding />}
        {adminTab === 'hero' && <AdminHero />}
        {adminTab === 'currency' && <AdminCurrency />}
        {adminTab === 'whatsapp' && <AdminWhatsAppContact />}
        {adminTab === 'order-slip' && <AdminOrderSlipSettings />}
        {adminTab === 'account' && <AdminAccount />}
      </AdminLayout>
    );
  }

  // Customer Frontend
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#231F20] selection:bg-[#722F37] selection:text-white">
      {/* Top Navbar */}
      <Navbar currentPage={currentPage} onNavigate={navigate} />

      {/* Cart Drawer */}
      <CartDrawer onNavigate={navigate} />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Customer Account / Login Modal */}
      <CustomerLoginModal onNavigate={navigate} />

      {/* Customer Page Routing */}
      <div className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'products' && (
          <ProductsPage
            initialCategory={navParams.category}
            initialSearch={navParams.search}
            initialSaleOnly={navParams.saleOnly}
            initialNewOnly={navParams.newArrivals}
            initialWishlistOnly={navParams.wishlistOnly}
            onSelectProduct={handleSelectProduct}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'sale' && (
          <SalePage
            onSelectProduct={handleSelectProduct}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => navigate('products')}
            onNavigate={navigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'search' && (
          <SearchResultsPage
            query={navParams.query || ''}
            onSelectProduct={handleSelectProduct}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'cart' && <CartPage onNavigate={navigate} />}

        {currentPage === 'checkout' && (
          <CheckoutPage
            initialNotes={navParams.notes}
            onNavigate={navigate}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentPage === 'thank-you' && (
          <ThankYouPage order={confirmedOrder} onNavigate={navigate} />
        )}

        {currentPage === 'contact' && <ContactPage />}
      </div>

      {/* Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <WishlistProvider>
            <CustomerAuthProvider>
              <AppContent />
            </CustomerAuthProvider>
          </WishlistProvider>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
