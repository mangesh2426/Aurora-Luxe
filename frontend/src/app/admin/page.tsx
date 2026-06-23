"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Product, Order } from "@/types";
import { BarChart3, Gem, ShoppingCart, Users, DollarSign, ShoppingBag, Tag, Plus, Eye, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api, { mapBackendProduct } from "@/lib/api";

export default function AdminPage() {
  const { orders, updateOrderStatus, updateOrderPaymentStatus, user, login, logout } = useStore();
  const [mounted, setMounted] = useState(false);
  
  // Authentication Portal States
  const [portalEmail, setPortalEmail] = useState("admin@auroraluxe.com");
  const [portalPassword, setPortalPassword] = useState("admin123");
  const [portalError, setPortalError] = useState("");
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePortalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPortalLoading(true);
    setPortalError("");

    try {
      const res = await api.post("/auth/login", {
        email: portalEmail,
        password: portalPassword
      });

      const { user: userData, token } = res.data;
      const role = userData.role.toLowerCase();
      
      if (role !== "admin") {
        setPortalError("Access denied. Admin privileges required.");
        return;
      }

      const name = `${userData.firstName} ${userData.lastName}`;
      login(userData.id, userData.email, name, role, token);
      localStorage.setItem("aurora_user_session", JSON.stringify({ 
        id: userData.id, 
        email: userData.email, 
        name, 
        role, 
        token 
      }));
    } catch (error: any) {
      console.error(error);
      setPortalError(error.response?.data?.message || "Invalid administrator credentials.");
    } finally {
      setPortalLoading(false);
    }
  };

  const [activePanel, setActivePanel] = useState<"overview" | "products" | "orders" | "customers">("overview");
  
  // Local state for product list
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);

  // Form states for adding products
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Rings");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");

  useEffect(() => {
    if (activePanel === "products") {
      fetchProducts();
    }
  }, [activePanel]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get('/products');
      setAdminProducts(res.data.data.map(mapBackendProduct));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const paidOrders = orders.filter(o => o.paymentStatus === "Paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  // Customer directories (aggregate spends by customer email)
  const customersMap: { [email: string]: { name: string; phone: string; address: string; totalSpend: number } } = {};
  orders.forEach(o => {
    const email = o.customer.email.toLowerCase();
    if (!customersMap[email]) {
      customersMap[email] = {
        name: o.customer.name,
        phone: o.customer.phone,
        address: o.customer.address,
        totalSpend: 0
      };
    }
    customersMap[email].totalSpend += o.total;
  });

  const handleDeleteProduct = async (id: string) => {
    try {
      // API call to delete
      await api.delete(`/products/${id}`);
      setAdminProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete product. Ensure it has no related orders.");
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProdId = newProdName.toLowerCase().replace(/\s+/g, "-");
    
    try {
      const res = await api.post('/products', {
        id: newProdId,
        name: newProdName,
        slug: newProdId,
        description: newProdDesc,
        price: parseInt(newProdPrice) || 0,
        categoryId: "1", // TODO: proper category ID mapping or let backend handle it via name
        finishes: ["Champagne Gold"],
        materials: ["18k Solid Gold"],
        stock: 50,
        rating: 5.0,
        reviewsCount: 0,
        isNewArrival: true,
        isBestSeller: false,
        images: {
          create: [
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMSEn5M-kqjnfBe6p3P8Ro25F6VGMPu1GWmuVqIVl_JPMd2a7Z68bxY8zySw27Zx_sMXueziaJMbwfHBb98K45KbeElTVnZZI5gsCsTbbntA8WyAvmUen290EGizZwR0Vmqy275zvNjM7k6lAFZnqA1kRA_Mh5qQSf1LNnYBZ_6vJKufe742YAKYRwp6Ql8c64fQkhmO4EFVW0VpwDZUQmUZjjI4fUnnX40sU3U9H_zo20Cr1HWFWszcbYNJav1t1g9FjJNvHs6VQ" }
          ]
        }
      });
      
      setAdminProducts(prev => [mapBackendProduct(res.data.data), ...prev]);
      setProductModalOpen(false);
      setNewProdName("");
      setNewProdPrice("");
      setNewProdDesc("");
    } catch (e) {
      console.error(e);
      alert("Failed to add product");
    }
  };

  // Safe client check to prevent flicker
  if (!mounted) {
    return (
      <main className="min-h-screen bg-surface-container-low flex items-center justify-center pt-[80px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-[11px] text-on-surface-variant uppercase tracking-[0.2em] font-semibold">Verifying Portal Access...</p>
        </div>
      </main>
    );
  }

  // Admin access validation gateway
  if (mounted && user?.role !== "admin") {
    return (
      <main className="min-h-screen bg-surface-container-low flex items-center justify-center px-6 py-24 pt-[120px]">
        <div className="w-full max-w-[440px] bg-white border border-outline/35 p-10 shadow-sm relative">
          <div className="text-center mb-10">
            <span className="font-display text-[11px] text-primary tracking-[0.25em] uppercase block mb-3 font-semibold">Aurora Luxe Control Hub</span>
            <h1 className="font-display text-[32px] text-on-background leading-tight">Admin Portal</h1>
            <p className="font-body text-[13px] text-on-surface-variant font-light mt-2">Authentication required for workspace access.</p>
          </div>

          <form onSubmit={handlePortalSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-email" className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Admin Email</label>
              <input
                type="email"
                id="admin-email"
                value={portalEmail}
                onChange={(e) => setPortalEmail(e.target.value)}
                className="w-full h-12 bg-transparent border-b border-outline focus:border-primary transition-colors font-body text-[14px] text-on-background placeholder-on-surface-variant outline-none"
                placeholder="admin@email.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="admin-password" className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Secret Key / Password</label>
              <input
                type="password"
                id="admin-password"
                value={portalPassword}
                onChange={(e) => setPortalPassword(e.target.value)}
                className="w-full h-12 bg-transparent border-b border-outline focus:border-primary transition-colors font-body text-[14px] text-on-background placeholder-on-surface-variant outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {portalError && <p className="text-[12px] text-error font-medium text-center">{portalError}</p>}

            <button
              type="submit"
              disabled={portalLoading}
              className="w-full h-14 bg-on-background text-white font-label-caps text-[12px] tracking-[0.25em] uppercase hover:bg-primary transition-colors flex items-center justify-center relative disabled:opacity-50 cursor-pointer font-bold"
            >
              <span>{portalLoading ? "Authenticating..." : "Unlock Console"}</span>
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-outline/30 flex justify-between items-center">
            <Link href="/" className="font-label-caps text-[10px] tracking-[0.1em] uppercase text-on-surface-variant hover:text-primary transition-colors">
              &larr; Back to Store
            </Link>
            <span className="font-body text-[10px] text-on-surface-variant/70 italic">Secure Client Sandbox</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-container-low flex flex-col md:flex-row max-w-container-max mx-auto w-full pt-[80px] pb-32 overflow-hidden">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-[240px] bg-on-background text-white p-6 shrink-0 flex flex-col justify-between">
        <div>
          <div className="font-display text-[22px] text-primary tracking-widest mb-10 text-center md:text-left font-light">HUB <span className="font-semibold text-white">CONSOLE</span></div>
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "products", label: "Inventory", icon: Gem },
              { id: "orders", label: "Orders Log", icon: ShoppingCart },
              { id: "customers", label: "Customers", icon: Users }
            ].map(item => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id as any)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-none text-[13px] font-label-caps tracking-wider uppercase transition-colors shrink-0 cursor-pointer ${
                    activePanel === item.id ? "bg-white/10 text-primary border-l-2 border-primary font-semibold" : "text-white/60 hover:text-white"
                  }`}
                >
                  <IconComponent size={18} className="stroke-[1.5]" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Exit Admin console button */}
        <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-2">
          <button
            onClick={() => {
              logout();
              localStorage.removeItem("aurora_user_session");
            }}
            className="flex items-center gap-3 px-4 py-3 text-[13px] font-label-caps tracking-wider uppercase transition-colors text-red-400 hover:text-red-300 hover:bg-white/5 cursor-pointer w-full text-left"
          >
            <X size={18} className="stroke-[1.5]" />
            Exit Hub
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-grow p-6 md:p-10 space-y-8">
        <div className="flex justify-between items-center border-b border-outline pb-6">
          <div>
            <h1 className="font-display text-[32px] md:text-[38px] text-on-background leading-tight font-light">Admin Dashboard</h1>
            <p className="font-body text-[12px] text-on-surface-variant font-light mt-1">Live Store Sync Status: OK</p>
          </div>
          <Link href="/" className="btn border border-outline px-6 py-2.5 font-label-caps text-[9px] tracking-wider uppercase bg-white hover:bg-surface transition-colors font-semibold">
            View Storefront
          </Link>
        </div>

        {/* --- PANEL 1: OVERVIEW SUMMARY --- */}
        <AnimatePresence mode="wait">
          {activePanel === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Overview Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 border border-outline/35 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase font-semibold">Total Revenue</span>
                    <div className="font-body text-[22px] font-bold text-on-background mt-2">${totalRevenue.toLocaleString()}</div>
                  </div>
                  <DollarSign size={28} className="text-primary stroke-[1.5]" />
                </div>
                <div className="bg-white p-6 border border-outline/35 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase font-semibold">Orders Logged</span>
                    <div className="font-body text-[22px] font-bold text-on-background mt-2">{orders.length}</div>
                  </div>
                  <ShoppingBag size={28} className="text-primary stroke-[1.5]" />
                </div>
                <div className="bg-white p-6 border border-outline/35 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase font-semibold">Live Inventory</span>
                    <div className="font-body text-[22px] font-bold text-on-background mt-2">{adminProducts.length}</div>
                  </div>
                  <Tag size={28} className="text-primary stroke-[1.5]" />
                </div>
                <div className="bg-white p-6 border border-outline/35 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase font-semibold">Unique Clients</span>
                    <div className="font-body text-[22px] font-bold text-on-background mt-2">{Object.keys(customersMap).length}</div>
                  </div>
                  <Users size={28} className="text-primary stroke-[1.5]" />
                </div>
              </div>

              {/* Recent orders logs */}
              <div className="bg-white border border-outline/35 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-outline flex justify-between items-center bg-surface-container-low">
                  <h3 className="font-display text-[18px] text-on-background font-semibold">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px] border-collapse">
                    <thead>
                      <tr className="bg-surface border-b border-outline/40 font-label-caps text-[9px] tracking-wider uppercase text-on-surface-variant">
                        <th className="p-4 pl-6">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Shipping Status</th>
                        <th className="p-4 pr-6 text-right">Total Billing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline/30 font-body text-on-surface">
                      {orders.slice(0, 4).map(o => (
                        <tr key={o.id}>
                          <td className="p-4 pl-6 font-semibold">{o.id}</td>
                          <td className="p-4">{o.customer.name}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider ${
                              o.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"
                            }`}>{o.paymentStatus}</span>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200">{o.status}</span>
                          </td>
                          <td className="p-4 pr-6 text-right font-medium">${o.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- PANEL 2: PRODUCT INVENTORY --- */}
          {activePanel === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-outline/35 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-outline flex justify-between items-center bg-surface-container-low">
                <h3 className="font-display text-[18px] text-on-background font-semibold">Store Designs</h3>
                <button
                  onClick={() => setProductModalOpen(true)}
                  className="bg-primary text-white px-5 py-2.5 font-label-caps text-[9px] tracking-widest uppercase hover:bg-primary-container transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <Plus size={14} className="stroke-[1.5]" /> Add Design
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px] border-collapse">
                  <thead>
                    <tr className="bg-surface border-b border-outline/40 font-label-caps text-[9px] tracking-wider uppercase text-on-surface-variant">
                      <th className="p-4 pl-6" style={{ width: "8%" }}>Image</th>
                      <th className="p-4" style={{ width: "35%" }}>Name</th>
                      <th className="p-4" style={{ width: "15%" }}>Category</th>
                      <th className="p-4" style={{ width: "15%" }}>Price</th>
                      <th className="p-4" style={{ width: "15%" }}>Stock Status</th>
                      <th className="p-4 pr-6 text-right" style={{ width: "12%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline/30 font-body text-on-surface">
                    {loadingProducts ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center">
                          <Loader2 className="animate-spin text-primary mx-auto" size={24} />
                        </td>
                      </tr>
                    ) : adminProducts.map(p => (
                      <tr key={p.id}>
                        <td className="p-4 pl-6">
                          <div className="relative w-10 h-10 overflow-hidden bg-surface border border-outline/25">
                            <Image src={p.imageUrl || '/hero_model.png'} alt={p.name} fill className="object-cover" />
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-on-background">{p.name}</td>
                        <td className="p-4">{p.category}</td>
                        <td className="p-4 font-medium">${p.price}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${p.inStock ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                            {p.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="text-error hover:underline text-[12px] font-bold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* --- PANEL 3: ORDERS LOG --- */}
          {activePanel === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-outline/35 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-outline bg-surface-container-low">
                <h3 className="font-display text-[18px] text-on-background font-semibold">Orders Log</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px] border-collapse">
                  <thead>
                    <tr className="bg-surface border-b border-outline/40 font-label-caps text-[9px] tracking-wider uppercase text-on-surface-variant">
                      <th className="p-4 pl-6">Order ID</th>
                      <th className="p-4">Client Detail</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment State</th>
                      <th className="p-4">Shipping Status</th>
                      <th className="p-4 pr-6 text-right">Tracking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline/30 font-body text-on-surface">
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td className="p-4 pl-6 font-semibold text-on-background">{o.id}</td>
                        <td className="p-4 leading-normal">
                          <div className="font-semibold text-on-background">{o.customer.name}</div>
                          <div className="text-[11px] text-on-surface-variant/80 font-light">{o.customer.email}</div>
                        </td>
                        <td className="p-4 font-semibold">${o.total.toLocaleString()}</td>
                        <td className="p-4">
                          <select
                            value={o.paymentStatus}
                            onChange={(e) => updateOrderPaymentStatus(o.id, e.target.value as any)}
                            className="border border-outline bg-white px-2 py-1 text-[12px] font-body outline-none focus:border-primary"
                          >
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Pending</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                            className="border border-outline bg-white px-2 py-1 text-[12px] font-body outline-none focus:border-primary"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <Link href={`/tracking?orderId=${o.id}`} target="_blank" className="text-primary hover:underline text-[12px] font-bold flex items-center justify-end gap-1">
                            <Eye size={14} className="stroke-[1.5]" /> Track
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* --- PANEL 4: CUSTOMERS DIRECTORY --- */}
          {activePanel === "customers" && (
            <motion.div
              key="customers"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-outline/35 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-outline bg-surface-container-low">
                <h3 className="font-display text-[18px] text-on-background font-semibold">Customers Directory</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px] border-collapse">
                  <thead>
                    <tr className="bg-surface border-b border-outline/40 font-label-caps text-[9px] tracking-wider uppercase text-on-surface-variant">
                      <th className="p-4 pl-6">Client Name</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4" style={{ width: "35%" }}>Address</th>
                      <th className="p-4 pr-6 text-right">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline/30 font-body text-on-surface">
                    {Object.keys(customersMap).map(email => {
                      const c = customersMap[email];
                      return (
                        <tr key={email}>
                          <td className="p-4 pl-6 font-semibold text-on-background">{c.name}</td>
                          <td className="p-4">{email}</td>
                          <td className="p-4 font-light text-[12px]">{c.phone}</td>
                          <td className="p-4 font-light text-[12px] leading-relaxed truncate max-w-[250px]">{c.address}</td>
                          <td className="p-4 pr-6 text-right font-bold text-primary">${c.totalSpend.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product insertion form modal */}
      <AnimatePresence>
        {productModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm pointer-events-auto"
              onClick={() => setProductModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-1/2 left-1/2 w-full max-w-[500px] bg-white z-50 shadow-2xl overflow-hidden border border-outline/30"
            >
              <div className="p-6 border-b border-outline flex justify-between items-center bg-surface-container-low">
                <h3 className="font-display text-[22px] text-on-background font-semibold">Add New Jewellery Design</h3>
                <button onClick={() => setProductModalOpen(false)} className="text-on-surface-variant hover:text-primary p-2 border border-outline rounded-full cursor-pointer">
                  <X size={16} className="stroke-[1.5]" />
                </button>
              </div>
              
              <form onSubmit={handleAddProductSubmit} className="p-6 space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Product Name</label>
                  <input
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="h-11 border border-outline px-4 text-[13px] font-body focus:border-primary outline-none"
                    placeholder="e.g. Baroque Pearl Ring"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="h-11 border border-outline px-4 text-[13px] font-body outline-none focus:border-primary"
                    >
                      <option value="Rings">Rings</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Necklaces">Necklaces</option>
                      <option value="Bracelets">Bracelets</option>
                      <option value="Combos">Combos & Sets</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Price ($)</label>
                    <input
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="h-11 border border-outline px-4 text-[13px] font-body focus:border-primary outline-none"
                      placeholder="850"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Description</label>
                  <textarea
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="h-24 border border-outline p-4 text-[13px] font-body focus:border-primary outline-none resize-none"
                    placeholder="Tell clients about this exquisite fine jewelry design..."
                    required
                  />
                </div>

                <button type="submit" className="w-full bg-primary text-white h-12 font-label-caps text-[11px] tracking-widest uppercase hover:bg-primary-container transition-colors flex items-center justify-center font-bold mt-2 cursor-pointer">
                  Save Product
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </main>
  );
}
