"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Product } from "@/types";
import {
  BarChart3,
  Gem,
  ShoppingCart,
  Users,
  DollarSign,
  ShoppingBag,
  Tag,
  Plus,
  Eye,
  X,
  Loader2,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  ChevronRight,
  Clipboard,
  AlertCircle,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api, { mapBackendProduct } from "@/lib/api";

export default function AdminPage() {
  const { user, login, logout } = useStore();
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

      const { user: userData, access_token: token } = res.data;
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
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);

  // New backend states
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [adminCustomers, setAdminCustomers] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Form states for adding/editing products
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newProdName, setNewProdName] = useState("");
  const [newProdSku, setNewProdSku] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState("");
  const [newProdDiscountPercent, setNewProdDiscountPercent] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdRating, setNewProdRating] = useState("5.0");
  const [newProdReviewsCount, setNewProdReviewsCount] = useState("0");
  const [newProdStock, setNewProdStock] = useState("50");
  const [newProdMaterials, setNewProdMaterials] = useState<string[]>(["18k Solid Gold"]);
  const [newProdFinishes, setNewProdFinishes] = useState<string[]>(["Champagne Gold"]);
  const [newProdIsBestSeller, setNewProdIsBestSeller] = useState(false);
  const [newProdIsNewArrival, setNewProdIsNewArrival] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newProdMainImage, setNewProdMainImage] = useState<File | null>(null);
  const [newProdSecondaryImages, setNewProdSecondaryImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Order Details Modal States
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [modalShippingStatus, setModalShippingStatus] = useState("PENDING");
  const [modalPaymentStatus, setModalPaymentStatus] = useState("PENDING");
  const [modalTrackingId, setModalTrackingId] = useState("");
  const [modalAdminNotes, setModalAdminNotes] = useState("");
  const [modalUpdating, setModalUpdating] = useState(false);

  // Orders Log Search and Filter States
  const [orderSearchText, setOrderSearchText] = useState("");
  const [orderPaymentFilter, setOrderPaymentFilter] = useState("ALL");
  const [orderShippingFilter, setOrderShippingFilter] = useState("ALL");
  const [orderDateFilter, setOrderDateFilter] = useState("ALL"); // ALL, TODAY, YESTERDAY, 7DAYS, 30DAYS, THISMONTH, CUSTOM
  const [orderCustomStartDate, setOrderCustomStartDate] = useState("");
  const [orderCustomEndDate, setOrderCustomEndDate] = useState("");

  // Inventory Search and Filter States
  const [inventorySearchText, setInventorySearchText] = useState("");
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState("ALL");
  const [inventoryStockFilter, setInventoryStockFilter] = useState("ALL"); // ALL, INSTOCK, LOWSTOCK, OUTOFSTOCK
  const [inventorySort, setInventorySort] = useState("NEWEST"); // NEWEST, OLDEST, LOWSTOCK, PRICE_ASC, PRICE_DESC

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories');
      const cats = res.data.data;
      setCategories(cats);
      if (cats.length > 0) {
        setNewProdCategory(cats[0].id);
      }
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      if (activePanel === "overview") {
        fetchStats();
      } else if (activePanel === "products") {
        fetchProducts();
      } else if (activePanel === "orders") {
        fetchOrders();
      } else if (activePanel === "customers") {
        fetchCustomers();
      }
    }
  }, [activePanel, user]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/admin/stats');
      setDashboardStats(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/orders/admin/all');
      setAdminOrders(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const res = await api.get('/admin/users');
      setAdminCustomers(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get('/products');
      const productsData = res.data.data.map((p: any) => {
        const mapped = mapBackendProduct(p);
        mapped.sku = p.sku || "";
        mapped.createdAt = p.createdAt;
        mapped.updatedAt = p.updatedAt;
        mapped.originalStock = p.stock;
        return mapped;
      });
      setAdminProducts(productsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      setAdminProducts(prev => prev.filter(p => p.id !== id));
      setDeleteConfirmId(null);
    } catch (e) {
      console.error(e);
      alert("Failed to delete product. Ensure it has no related orders.");
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setNewProdName("");
    setNewProdSku("");
    setNewProdPrice("");
    setNewProdOriginalPrice("");
    setNewProdDiscountPercent("");
    setNewProdDesc("");
    setNewProdRating("5.0");
    setNewProdReviewsCount("0");
    setNewProdStock("50");
    setNewProdMaterials(["18k Solid Gold"]);
    setNewProdFinishes(["Champagne Gold"]);
    setNewProdIsBestSeller(false);
    setNewProdIsNewArrival(true);
    setExistingImages([]);
    setNewProdMainImage(null);
    setNewProdSecondaryImages([]);
    if (categories.length > 0) setNewProdCategory(categories[0].id);
    setProductModalOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProductId(product.id);
    setNewProdName(product.name);
    setNewProdSku(product.sku || "");
    setNewProdCategory(product.categoryId || (categories.length > 0 ? categories[0].id : ""));
    setNewProdPrice(product.price.toString());
    setNewProdOriginalPrice(product.originalPrice ? product.originalPrice.toString() : "");
    setNewProdDiscountPercent(product.discountPercent ? product.discountPercent.toString() : "");
    setNewProdDesc(product.description || "");
    setNewProdRating(product.rating ? product.rating.toString() : "5.0");
    setNewProdReviewsCount(product.reviewsCount ? product.reviewsCount.toString() : "0");
    setNewProdStock(product.originalStock !== undefined ? product.originalStock.toString() : "50");
    setNewProdMaterials(product.materials || []);
    setNewProdFinishes(product.finishes || []);
    setNewProdIsBestSeller(product.isBestSeller || false);
    setNewProdIsNewArrival(product.isNewArrival || false);
    setExistingImages(product.images || (product.imageUrl ? [product.imageUrl] : []));
    setNewProdMainImage(null);
    setNewProdSecondaryImages([]);
    setProductModalOpen(true);
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalMainImage = existingImages.length > 0 ? existingImages[0] : null;
      let finalSecondaryImages = existingImages.length > 1 ? existingImages.slice(1) : [];

      if (newProdMainImage) {
        const formData = new FormData();
        formData.append("image", newProdMainImage);
        const uploadRes = await api.post("/products/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        finalMainImage = uploadRes.data.imageUrl;
      }

      if (newProdSecondaryImages.length > 0) {
        finalSecondaryImages = [];
        for (const file of newProdSecondaryImages) {
          const formData = new FormData();
          formData.append("image", file);
          const uploadRes = await api.post("/products/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          finalSecondaryImages.push(uploadRes.data.imageUrl);
        }
      }

      let uploadedImageUrls: string[] = [];
      if (finalMainImage) uploadedImageUrls.push(finalMainImage);
      uploadedImageUrls.push(...finalSecondaryImages);

      if (uploadedImageUrls.length === 0) {
        uploadedImageUrls = ["https://lh3.googleusercontent.com/aida-public/AB6AXuBMSEn5M-kqjnfBe6p3P8Ro25F6VGMPu1GWmuVqIVl_JPMd2a7Z68bxY8zySw27Zx_sMXueziaJMbwfHBb98K45KbeElTVnZZI5gsCsTbbntA8WyAvmUen290EGizZwR0Vmqy275zvNjM7k6lAFZnqA1kRA_Mh5qQSf1LNnYBZ_6vJKufe742YAKYRwp6Ql8c64fQkhmO4EFVW0VpwDZUQmUZjjI4fUnnX40sU3U9H_zo20Cr1HWFWszcbYNJav1t1g9FjJNvHs6VQ"];
      }

      const payload = {
        name: newProdName,
        sku: newProdSku || undefined,
        description: newProdDesc,
        price: parseFloat(newProdPrice) || 0,
        originalPrice: newProdOriginalPrice ? parseFloat(newProdOriginalPrice) : undefined,
        discountPercent: newProdDiscountPercent ? parseInt(newProdDiscountPercent) : undefined,
        categoryId: newProdCategory,
        finishes: newProdFinishes,
        materials: newProdMaterials,
        rating: parseFloat(newProdRating) || 5.0,
        reviewsCount: parseInt(newProdReviewsCount) || 0,
        isNewArrival: newProdIsNewArrival,
        isBestSeller: newProdIsBestSeller,
        images: uploadedImageUrls,
        stock: parseInt(newProdStock) || 0,
      };

      if (editingProductId) {
        const res = await api.patch(`/products/${editingProductId}`, payload);
        const mapped = mapBackendProduct(res.data.data);
        mapped.sku = res.data.data.sku || "";
        mapped.createdAt = res.data.data.createdAt;
        mapped.updatedAt = res.data.data.updatedAt;
        mapped.originalStock = res.data.data.stock;
        setAdminProducts(prev => prev.map(p => p.id === editingProductId ? mapped : p));
      } else {
        const res = await api.post('/products', payload);
        const mapped = mapBackendProduct(res.data.data);
        mapped.sku = res.data.data.sku || "";
        mapped.createdAt = res.data.data.createdAt;
        mapped.updatedAt = res.data.data.updatedAt;
        mapped.originalStock = res.data.data.stock;
        setAdminProducts(prev => [mapped, ...prev]);
      }

      setProductModalOpen(false);
    } catch (e) {
      console.error(e);
      alert(`Failed to ${editingProductId ? "update" : "add"} product`);
    } finally {
      setIsUploading(false);
    }
  };

  // Date and Time Helper formatting: 26 Jun 2026, 08:15 AM
  const formatDateTime = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    const day = date.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

    return `${day} ${month} ${year}, ${strTime}`;
  };

  const formatDateOnly = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    const day = date.getDate().toString().padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const formatTimeOnly = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  // Date filter logic validation
  const isWithinDateRange = (createdAtStr: string, filter: string, customStart?: string, customEnd?: string) => {
    const date = new Date(createdAtStr);
    const now = new Date();

    const startOfDay = (d: Date) => {
      const res = new Date(d);
      res.setHours(0, 0, 0, 0);
      return res;
    };

    const endOfDay = (d: Date) => {
      const res = new Date(d);
      res.setHours(23, 59, 59, 999);
      return res;
    };

    switch (filter) {
      case 'TODAY':
        return date >= startOfDay(now) && date <= endOfDay(now);
      case 'YESTERDAY': {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        return date >= startOfDay(yesterday) && date <= endOfDay(yesterday);
      }
      case '7DAYS': {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return date >= startOfDay(sevenDaysAgo);
      }
      case '30DAYS': {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return date >= startOfDay(thirtyDaysAgo);
      }
      case 'THISMONTH':
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      case 'CUSTOM': {
        if (!customStart || !customEnd) return true;
        const start = new Date(customStart);
        const end = new Date(customEnd);
        return date >= startOfDay(start) && date <= endOfDay(end);
      }
      default:
        return true;
    }
  };

  // Orders Log Filtering
  const filteredOrders = adminOrders.filter(o => {
    const query = orderSearchText.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(query) ||
      (o.orderNumber || '').toLowerCase().includes(query) ||
      (o.customerName || '').toLowerCase().includes(query) ||
      (o.customerEmail || '').toLowerCase().includes(query) ||
      (o.customerPhone || '').toLowerCase().includes(query);

    const matchesPayment = orderPaymentFilter === "ALL" || (o.paymentStatus || 'PENDING') === orderPaymentFilter;

    const matchesShipping = orderShippingFilter === "ALL" || (o.shippingStatus || 'PENDING') === orderShippingFilter;

    const matchesDate = orderDateFilter === "ALL" || isWithinDateRange(o.createdAt, orderDateFilter, orderCustomStartDate, orderCustomEndDate);

    return matchesSearch && matchesPayment && matchesShipping && matchesDate;
  });

  // Inventory Filtering & Sorting
  const filteredProducts = adminProducts.filter(p => {
    const query = inventorySearchText.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(query) ||
      (p.sku || '').toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);

    const matchesCategory = inventoryCategoryFilter === "ALL" || p.categoryId === inventoryCategoryFilter;

    const stockVal = p.originalStock || 0;
    let matchesStock = true;
    if (inventoryStockFilter === "INSTOCK") {
      matchesStock = stockVal > 10;
    } else if (inventoryStockFilter === "LOWSTOCK") {
      matchesStock = stockVal >= 1 && stockVal <= 10;
    } else if (inventoryStockFilter === "OUTOFSTOCK") {
      matchesStock = stockVal === 0;
    }

    return matchesSearch && matchesCategory && matchesStock;
  }).sort((a, b) => {
    if (inventorySort === "NEWEST") {
      return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
    } else if (inventorySort === "OLDEST") {
      return new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime();
    } else if (inventorySort === "LOWSTOCK") {
      return (a.originalStock || 0) - (b.originalStock || 0);
    } else if (inventorySort === "PRICE_ASC") {
      return Number(a.price) - Number(b.price);
    } else if (inventorySort === "PRICE_DESC") {
      return Number(b.price) - Number(a.price);
    }
    return 0;
  });

  // CSV Export Utility
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert("No orders to export");
      return;
    }

    const headers = [
      'Order Number',
      'Order Date',
      'Order Time',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Products Summary',
      'Quantity',
      'Total Amount',
      'Payment Status',
      'Shipping Status',
      'Tracking ID',
      'Admin Notes'
    ];

    const rows = filteredOrders.map(o => {
      const pSummary = o.items?.map((i: any) => `${i.product?.name || 'Product'} (x${i.quantity})`).join('; ') || '';
      const totalQty = o.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0;

      return [
        o.orderNumber || o.id.substring(0, 8),
        formatDateOnly(o.createdAt),
        formatTimeOnly(o.createdAt),
        o.customerName || `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.trim(),
        o.customerEmail || o.user?.email || '',
        o.customerPhone || 'N/A',
        `"${pSummary.replace(/"/g, '""')}"`,
        totalQty,
        o.totalAmount,
        o.paymentStatus || 'PENDING',
        o.shippingStatus || 'PENDING',
        o.trackingId || '',
        `"${(o.adminNotes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `aurora_luxe_orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setModalShippingStatus(order.shippingStatus || "PENDING");
    setModalPaymentStatus(order.paymentStatus || "PENDING");
    setModalTrackingId(order.trackingId || "");
    setModalAdminNotes(order.adminNotes || "");
    setOrderModalOpen(true);
  };

  const handleUpdateOrderDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setModalUpdating(true);
    try {
      const res = await api.patch(`/orders/admin/${selectedOrder.id}/status`, {
        status: modalShippingStatus,
        shippingStatus: modalShippingStatus,
        paymentStatus: modalPaymentStatus,
        trackingId: modalTrackingId || null,
        adminNotes: modalAdminNotes || null
      });

      const updated = res.data.data;
      setAdminOrders(prev => prev.map(o => o.id === selectedOrder.id ? {
        ...o,
        status: updated.status,
        shippingStatus: updated.shippingStatus || updated.status,
        paymentStatus: updated.paymentStatus || (updated.payment?.status === 'SUCCESS' ? 'SUCCESS' : 'PENDING'),
        trackingId: updated.trackingId,
        adminNotes: updated.adminNotes,
        payment: updated.payment
      } : o));

      alert("Order updated successfully!");
      setOrderModalOpen(false);
      setSelectedOrder(null);
      if (activePanel === "overview") fetchStats();
    } catch (err) {
      console.error(err);
      alert("Failed to update order details.");
    } finally {
      setModalUpdating(false);
    }
  };

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
                  className={`flex items-center gap-3 px-4 py-3 text-[13px] font-label-caps tracking-wider uppercase transition-colors shrink-0 cursor-pointer ${
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
      <div className="flex-grow p-6 md:p-10 space-y-8 overflow-x-hidden">
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
                    <div className="font-body text-[22px] font-bold text-on-background mt-2">₹{(dashboardStats?.revenue || 0).toLocaleString()}</div>
                  </div>
                  <DollarSign size={28} className="text-primary stroke-[1.5]" />
                </div>
                <div className="bg-white p-6 border border-outline/35 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase font-semibold">Orders Today</span>
                    <div className="font-body text-[22px] font-bold text-on-background mt-2">{dashboardStats?.ordersToday || 0}</div>
                  </div>
                  <Calendar size={28} className="text-primary stroke-[1.5]" />
                </div>
                <div className="bg-white p-6 border border-outline/35 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase font-semibold">Pending Orders</span>
                    <div className="font-body text-[22px] font-bold text-on-background mt-2">{dashboardStats?.pendingOrders || 0}</div>
                  </div>
                  <Clock size={28} className="text-primary stroke-[1.5]" />
                </div>
                <div className="bg-white p-6 border border-outline/35 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase font-semibold">Delivered Orders</span>
                    <div className="font-body text-[22px] font-bold text-on-background mt-2">{dashboardStats?.deliveredOrders || 0}</div>
                  </div>
                  <ShoppingBag size={28} className="text-primary stroke-[1.5]" />
                </div>
              </div>

              {/* Row 2 Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 border border-outline/35 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase font-semibold">Cancelled Orders</span>
                    <div className="font-body text-[22px] font-bold text-on-background mt-2">{dashboardStats?.cancelledOrders || 0}</div>
                  </div>
                  <AlertCircle size={28} className="text-primary stroke-[1.5]" />
                </div>
                <div className="bg-white p-6 border border-outline/35 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase font-semibold">Live Inventory</span>
                    <div className="font-body text-[22px] font-bold text-on-background mt-2">{dashboardStats?.liveInventory || 0} units</div>
                  </div>
                  <Tag size={28} className="text-primary stroke-[1.5]" />
                </div>
                <div className="bg-white p-6 border border-outline/35 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase font-semibold">Low Stock Products</span>
                    <div className="font-body text-[22px] font-bold text-on-background mt-2 text-amber-600">{dashboardStats?.lowStockProducts || 0} items</div>
                  </div>
                  <Gem size={28} className="text-primary stroke-[1.5]" />
                </div>
                <div className="bg-white p-6 border border-outline/35 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase font-semibold">Unique Customers</span>
                    <div className="font-body text-[22px] font-bold text-on-background mt-2">{dashboardStats?.usersCount || 0}</div>
                  </div>
                  <Users size={28} className="text-primary stroke-[1.5]" />
                </div>
              </div>

              {/* Timestamp information */}
              <div className="text-[11px] text-on-surface-variant font-light flex justify-between items-center bg-white p-4 border border-outline/25 shadow-sm">
                <div>Last Updated: <span className="font-medium text-on-background">{formatDateTime(dashboardStats?.lastUpdated)}</span></div>
                <div>Latest Order Placed: <span className="font-medium text-on-background">{formatDateTime(dashboardStats?.latestOrderTime)}</span></div>
              </div>

              {/* Recent transactions logs */}
              <div className="bg-white border border-outline/35 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-outline flex justify-between items-center bg-surface-container-low">
                  <h3 className="font-display text-[18px] text-on-background font-semibold">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px] border-collapse">
                    <thead>
                      <tr className="bg-surface border-b border-outline/40 font-label-caps text-[9px] tracking-wider uppercase text-on-surface-variant">
                        <th className="p-4 pl-6">Order ID</th>
                        <th className="p-4">Date & Time</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Shipping Status</th>
                        <th className="p-4 text-right">Total Billing</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline/30 font-body text-on-surface">
                      {loadingStats ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center">
                            <Loader2 className="animate-spin text-primary mx-auto" size={24} />
                          </td>
                        </tr>
                      ) : dashboardStats?.recentOrders?.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-on-surface-variant/70 italic bg-surface-container-lowest">
                            No transactions recorded.
                          </td>
                        </tr>
                      ) : (
                        dashboardStats?.recentOrders?.map((o: any) => (
                          <tr key={o.id} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="p-4 pl-6 font-semibold">{o.orderNumber || o.id.substring(0, 8)}</td>
                            <td className="p-4 text-[12px]">{formatDateTime(o.createdAt)}</td>
                            <td className="p-4 font-medium">{o.customerName || `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.trim() || 'Guest'}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider ${
                                (o.paymentStatus || 'PENDING') === 'SUCCESS' ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                                (o.paymentStatus || 'PENDING') === 'PENDING' ? "bg-amber-50 text-amber-600 border border-amber-200" :
                                "bg-red-50 text-red-600 border border-red-200"
                              }`}>{o.paymentStatus || "PENDING"}</span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                (o.shippingStatus || 'PENDING') === 'DELIVERED' ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                                (o.shippingStatus || 'PENDING') === 'CANCELLED' ? "bg-red-50 text-red-600 border-red-200" :
                                (o.shippingStatus || 'PENDING') === 'SHIPPED' ? "bg-blue-50 text-blue-600 border-blue-200" :
                                "bg-amber-50 text-amber-600 border-amber-200"
                              }`}>{o.shippingStatus || "PENDING"}</span>
                            </td>
                            <td className="p-4 text-right font-medium">₹{Number(o.totalAmount).toLocaleString()}</td>
                            <td className="p-4 pr-6 text-right">
                              <button
                                onClick={() => handleOpenOrderDetails(o)}
                                className="text-primary hover:underline text-[12px] font-bold cursor-pointer bg-transparent border-none outline-none"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
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
              className="space-y-6"
            >
              {/* Inventory Header */}
              <div className="bg-white border border-outline/35 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-display text-[22px] text-on-background font-semibold">Store Inventory</h3>
                  <p className="font-body text-[12px] text-on-surface-variant font-light mt-1">Manage anti-tarnish jewelry catalogs and quantities.</p>
                </div>
                <button
                  onClick={handleOpenCreateModal}
                  className="bg-on-background text-white px-6 py-3 font-label-caps text-[10px] tracking-widest uppercase hover:bg-primary transition-colors flex items-center gap-2 font-bold cursor-pointer shrink-0"
                >
                  <Plus size={16} className="stroke-[1.5]" /> Add Jewelry Item
                </button>
              </div>

              {/* Filters Bar */}
              <div className="bg-white border border-outline/35 shadow-sm p-6 flex flex-col lg:flex-row items-center gap-4">
                {/* Search */}
                <div className="w-full lg:flex-grow relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface-variant/60 pointer-events-none">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by Name, SKU, or Category..."
                    value={inventorySearchText}
                    onChange={(e) => setInventorySearchText(e.target.value)}
                    className="w-full h-11 border border-outline/65 pl-10 pr-4 text-[13px] font-body focus:border-primary outline-none bg-surface-container-lowest"
                  />
                </div>

                {/* Filters group */}
                <div className="w-full lg:w-auto flex flex-wrap sm:flex-nowrap gap-4 items-center shrink-0">
                  <div className="w-full sm:w-[160px] flex flex-col gap-1.5">
                    <span className="font-label-caps text-[8px] tracking-widest text-on-surface-variant font-bold uppercase">Category</span>
                    <select
                      value={inventoryCategoryFilter}
                      onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                      className="h-10 border border-outline px-3 text-[12px] font-body outline-none focus:border-primary bg-white"
                    >
                      <option value="ALL">All Categories</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-[150px] flex flex-col gap-1.5">
                    <span className="font-label-caps text-[8px] tracking-widest text-on-surface-variant font-bold uppercase">Stock Status</span>
                    <select
                      value={inventoryStockFilter}
                      onChange={(e) => setInventoryStockFilter(e.target.value)}
                      className="h-10 border border-outline px-3 text-[12px] font-body outline-none focus:border-primary bg-white"
                    >
                      <option value="ALL">All Levels</option>
                      <option value="INSTOCK">In Stock (&gt;10)</option>
                      <option value="LOWSTOCK">Low Stock (1-10)</option>
                      <option value="OUTOFSTOCK">Out of Stock (0)</option>
                    </select>
                  </div>

                  <div className="w-full sm:w-[160px] flex flex-col gap-1.5">
                    <span className="font-label-caps text-[8px] tracking-widest text-on-surface-variant font-bold uppercase">Sort By</span>
                    <select
                      value={inventorySort}
                      onChange={(e) => setInventorySort(e.target.value)}
                      className="h-10 border border-outline px-3 text-[12px] font-body outline-none focus:border-primary bg-white"
                    >
                      <option value="NEWEST">Newest Added</option>
                      <option value="OLDEST">Oldest Added</option>
                      <option value="LOWSTOCK">Lowest Stock</option>
                      <option value="PRICE_ASC">Price: Low to High</option>
                      <option value="PRICE_DESC">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white border border-outline/35 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px] border-collapse">
                    <thead>
                      <tr className="bg-surface border-b border-outline/40 font-label-caps text-[9px] tracking-wider uppercase text-on-surface-variant">
                        <th className="p-4 pl-6" style={{ width: "8%" }}>Image</th>
                        <th className="p-4" style={{ width: "20%" }}>Name</th>
                        <th className="p-4" style={{ width: "12%" }}>SKU</th>
                        <th className="p-4" style={{ width: "12%" }}>Category</th>
                        <th className="p-4 text-center" style={{ width: "10%" }}>Qty</th>
                        <th className="p-4 text-right" style={{ width: "10%" }}>Price</th>
                        <th className="p-4 text-right" style={{ width: "10%" }}>Discount</th>
                        <th className="p-4 text-center" style={{ width: "12%" }}>Stock Status</th>
                        <th className="p-4 pr-6 text-right" style={{ width: "12%" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline/30 font-body text-on-surface">
                      {loadingProducts ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center">
                            <Loader2 className="animate-spin text-primary mx-auto" size={24} />
                          </td>
                        </tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-on-surface-variant/70 italic">
                            No products found matching the criteria.
                          </td>
                        </tr>
                      ) : filteredProducts.map(p => {
                        const stockVal = p.originalStock || 0;
                        let statusColor = "bg-emerald-50 text-emerald-600 border-emerald-200";
                        let statusText = "In Stock";

                        if (stockVal === 0) {
                          statusColor = "bg-red-50 text-red-600 border-red-200";
                          statusText = "Out of Stock";
                        } else if (stockVal <= 10) {
                          statusColor = "bg-amber-50 text-amber-600 border-amber-200";
                          statusText = "Low Stock";
                        }

                        return (
                          <tr key={p.id} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="p-4 pl-6">
                              <div className="relative w-12 h-12 overflow-hidden bg-surface border border-outline/25 shadow-sm">
                                <Image src={p.imageUrl || '/hero_model.png'} alt={p.name} fill className="object-cover" />
                              </div>
                            </td>
                            <td className="p-4 font-semibold text-on-background leading-normal">{p.name}</td>
                            <td className="p-4 font-mono text-[11px] text-on-surface-variant">{p.sku || "N/A"}</td>
                            <td className="p-4">{p.category}</td>
                            <td className="p-4 text-center font-semibold">{stockVal}</td>
                            <td className="p-4 text-right font-medium">₹{p.price}</td>
                            <td className="p-4 text-right text-on-surface-variant font-light">
                              {p.discount ? `${p.discount}% Off` : "None"}
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor}`}>
                                {statusText}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  onClick={() => handleEditProduct(p)}
                                  className="text-primary hover:underline text-[12px] font-bold cursor-pointer bg-transparent border-none outline-none"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(p.id)}
                                  className="text-error hover:underline text-[12px] font-bold cursor-pointer bg-transparent border-none outline-none"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
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
              className="space-y-6"
            >
              <div className="bg-white border border-outline/35 shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-display text-[22px] text-on-background font-semibold">Orders Operations Log</h3>
                  <p className="font-body text-[12px] text-on-surface-variant font-light mt-1">Review orders, manage payment status, and assign shipping details.</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="border border-outline bg-white px-5 py-3 font-label-caps text-[10px] tracking-widest uppercase hover:bg-surface transition-colors flex items-center gap-2 font-bold cursor-pointer shrink-0"
                >
                  <Download size={16} /> Export Orders CSV
                </button>
              </div>

              {/* Filters Panel */}
              <div className="bg-white border border-outline/35 shadow-sm p-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                  <div className="lg:col-span-2 relative w-full">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface-variant/60 pointer-events-none">
                      <Search size={16} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search by ID, Customer Name, Email, or Phone..."
                      value={orderSearchText}
                      onChange={(e) => setOrderSearchText(e.target.value)}
                      className="w-full h-11 border border-outline/65 pl-10 pr-4 text-[13px] font-body focus:border-primary outline-none bg-surface-container-lowest"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-label-caps text-[8px] tracking-widest text-on-surface-variant font-bold uppercase">Payment State</span>
                    <select
                      value={orderPaymentFilter}
                      onChange={(e) => setOrderPaymentFilter(e.target.value)}
                      className="h-10 border border-outline px-3 text-[12px] font-body outline-none focus:border-primary bg-white"
                    >
                      <option value="ALL">All Payments</option>
                      <option value="PENDING">Pending (COD/Unpaid)</option>
                      <option value="SUCCESS">Success (Paid)</option>
                      <option value="FAILED">Failed</option>
                      <option value="REFUNDED">Refunded</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-label-caps text-[8px] tracking-widest text-on-surface-variant font-bold uppercase">Shipping Status</span>
                    <select
                      value={orderShippingFilter}
                      onChange={(e) => setOrderShippingFilter(e.target.value)}
                      className="h-10 border border-outline px-3 text-[12px] font-body outline-none focus:border-primary bg-white"
                    >
                      <option value="ALL">All Shipments</option>
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline/20 grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-label-caps text-[8px] tracking-widest text-on-surface-variant font-bold uppercase">Date Range Filter</span>
                    <select
                      value={orderDateFilter}
                      onChange={(e) => setOrderDateFilter(e.target.value)}
                      className="h-10 border border-outline px-3 text-[12px] font-body outline-none focus:border-primary bg-white"
                    >
                      <option value="ALL">All Time</option>
                      <option value="TODAY">Today</option>
                      <option value="YESTERDAY">Yesterday</option>
                      <option value="7DAYS">Last 7 Days</option>
                      <option value="30DAYS">Last 30 Days</option>
                      <option value="THISMONTH">This Month</option>
                      <option value="CUSTOM">Custom Date Range</option>
                    </select>
                  </div>

                  {orderDateFilter === "CUSTOM" && (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <span className="font-label-caps text-[8px] tracking-widest text-on-surface-variant font-bold uppercase">Start Date</span>
                        <input
                          type="date"
                          value={orderCustomStartDate}
                          onChange={(e) => setOrderCustomStartDate(e.target.value)}
                          className="h-10 border border-outline px-3 text-[12px] font-body outline-none focus:border-primary bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="font-label-caps text-[8px] tracking-widest text-on-surface-variant font-bold uppercase">End Date</span>
                        <input
                          type="date"
                          value={orderCustomEndDate}
                          onChange={(e) => setOrderCustomEndDate(e.target.value)}
                          className="h-10 border border-outline px-3 text-[12px] font-body outline-none focus:border-primary bg-white"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-outline/35 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px] border-collapse">
                    <thead>
                      <tr className="bg-surface border-b border-outline/40 font-label-caps text-[9px] tracking-wider uppercase text-on-surface-variant">
                        <th className="p-4 pl-6" style={{ width: "10%" }}>Order ID</th>
                        <th className="p-4" style={{ width: "10%" }}>Order Date</th>
                        <th className="p-4" style={{ width: "8%" }}>Order Time</th>
                        <th className="p-4" style={{ width: "12%" }}>Customer Name</th>
                        <th className="p-4" style={{ width: "12%" }}>Email</th>
                        <th className="p-4" style={{ width: "10%" }}>Phone</th>
                        <th className="p-4" style={{ width: "15%" }}>Product Details</th>
                        <th className="p-4 text-center" style={{ width: "5%" }}>Qty</th>
                        <th className="p-4 text-right" style={{ width: "8%" }}>Total</th>
                        <th className="p-4 text-center" style={{ width: "8%" }}>Payment</th>
                        <th className="p-4 text-center" style={{ width: "8%" }}>Shipping</th>
                        <th className="p-4" style={{ width: "8%" }}>Tracking ID</th>
                        <th className="p-4 pr-6 text-right" style={{ width: "8%" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline/30 font-body text-on-surface">
                      {loadingOrders ? (
                        <tr>
                          <td colSpan={13} className="p-8 text-center">
                            <Loader2 className="animate-spin text-primary mx-auto" size={24} />
                          </td>
                        </tr>
                      ) : filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={13} className="p-8 text-center text-on-surface-variant/70 italic bg-surface-container-lowest">
                            No orders found matching the filter criteria.
                          </td>
                        </tr>
                      ) : filteredOrders.map((o: any) => {
                        const totalQty = o.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
                        const productSummary = o.items?.map((item: any) => `${item.product?.name || 'Product'} (x${item.quantity})`).join(', ') || 'N/A';

                        return (
                          <tr key={o.id} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="p-4 pl-6 font-semibold text-on-background">{o.orderNumber || o.id.substring(0, 8)}</td>
                            <td className="p-4 text-[12px]">{formatDateOnly(o.createdAt)}</td>
                            <td className="p-4 text-[12px]">{formatTimeOnly(o.createdAt)}</td>
                            <td className="p-4 font-medium leading-normal">{o.customerName || `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.trim() || 'Guest'}</td>
                            <td className="p-4 text-[12px] text-on-surface-variant truncate max-w-[120px]">{o.customerEmail || o.user?.email || 'N/A'}</td>
                            <td className="p-4 text-[12px] text-on-surface-variant">{o.customerPhone || 'N/A'}</td>
                            <td className="p-4 text-[12px] leading-tight truncate max-w-[160px] text-on-surface-variant/90" title={productSummary}>
                              {productSummary}
                            </td>
                            <td className="p-4 text-center font-semibold">{totalQty}</td>
                            <td className="p-4 text-right font-medium">₹{Number(o.totalAmount).toLocaleString()}</td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                                (o.paymentStatus || 'PENDING') === 'SUCCESS' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                (o.paymentStatus || 'PENDING') === 'PENDING' ? "bg-amber-50 text-amber-600 border-amber-200" :
                                "bg-red-50 text-red-600 border-red-200"
                              }`}>{o.paymentStatus || "PENDING"}</span>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border uppercase ${
                                (o.shippingStatus || 'PENDING') === 'DELIVERED' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                (o.shippingStatus || 'PENDING') === 'CANCELLED' ? "bg-red-50 text-red-600 border-red-200" :
                                (o.shippingStatus || 'PENDING') === 'SHIPPED' ? "bg-blue-50 text-blue-600 border-blue-200" :
                                "bg-amber-50 text-amber-600 border-amber-200"
                              }`}>{o.shippingStatus || "PENDING"}</span>
                            </td>
                            <td className="p-4 font-mono text-[11px] text-on-surface-variant truncate max-w-[80px]">{o.trackingId || 'N/A'}</td>
                            <td className="p-4 pr-6 text-right">
                              <button
                                onClick={() => handleOpenOrderDetails(o)}
                                className="text-primary hover:underline text-[12px] font-bold cursor-pointer bg-transparent border-none outline-none"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
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
                      <th className="p-4" style={{ width: "25%" }}>Address</th>
                      <th className="p-4">Role</th>
                      <th className="p-4 pr-6 text-right">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline/30 font-body text-on-surface">
                    {loadingCustomers ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center">
                          <Loader2 className="animate-spin text-primary mx-auto" size={24} />
                        </td>
                      </tr>
                    ) : adminCustomers.map((c: any) => (
                      <tr key={c.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="p-4 pl-6 font-semibold text-on-background">{c.firstName} {c.lastName}</td>
                        <td className="p-4">{c.email}</td>
                        <td className="p-4 font-light text-[12px]">{c.phone}</td>
                        <td className="p-4 font-light text-[12px] leading-relaxed truncate max-w-[200px]">{c.address}</td>
                        <td className="p-4 font-bold text-primary">
                          <select
                            value={c.role}
                            onChange={async (e) => {
                              try {
                                await api.patch(`/admin/users/${c.id}/role`, { role: e.target.value });
                                setAdminCustomers(prev => prev.map(user => user.id === c.id ? { ...user, role: e.target.value } : user));
                              } catch (err) {
                                console.error(err);
                                alert("Failed to update role");
                              }
                            }}
                            className="border border-outline bg-white px-2 py-1 text-[12px] font-body outline-none focus:border-primary"
                          >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </td>
                        <td className="p-4 pr-6 text-right font-semibold text-on-background">
                          ₹{c.totalSpent?.toLocaleString() || '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- INVENTORY EDIT MODAL --- */}
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
                <h3 className="font-display text-[22px] text-on-background font-semibold">{editingProductId ? "Edit Design" : "Add New Jewellery Design"}</h3>
                <button onClick={() => setProductModalOpen(false)} className="text-on-surface-variant hover:text-primary p-2 border border-outline rounded-full cursor-pointer">
                  <X size={16} className="stroke-[1.5]" />
                </button>
              </div>

              <form onSubmit={handleAddProductSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
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
                    <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">SKU (Unique Code)</label>
                    <input
                      type="text"
                      value={newProdSku}
                      onChange={(e) => setNewProdSku(e.target.value)}
                      className="h-11 border border-outline px-4 text-[13px] font-body focus:border-primary outline-none"
                      placeholder="e.g. LUMINA_PNDT"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="h-11 border border-outline px-4 text-[13px] font-body outline-none focus:border-primary bg-white"
                      required
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Price (₹)</label>
                    <input
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="h-11 border border-outline px-4 text-[13px] font-body focus:border-primary outline-none"
                      placeholder="1250"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Orig Price (₹)</label>
                    <input
                      type="number"
                      value={newProdOriginalPrice}
                      onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                      className="h-11 border border-outline px-4 text-[13px] font-body focus:border-primary outline-none"
                      placeholder="1450"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Stock Qty</label>
                    <input
                      type="number"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="h-11 border border-outline px-4 text-[13px] font-body focus:border-primary outline-none"
                      placeholder="50"
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Base Metals</label>
                    {["18k Solid Gold", "14k Solid Gold", "925 Sterling Silver", "Platinum"].map(m => (
                      <label key={m} className="flex items-center gap-2 text-[12px] font-body">
                        <input
                          type="checkbox"
                          checked={newProdMaterials.includes(m)}
                          onChange={(e) => {
                            if (e.target.checked) setNewProdMaterials([...newProdMaterials, m]);
                            else setNewProdMaterials(newProdMaterials.filter(x => x !== m));
                          }}
                        />
                        {m}
                      </label>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Color Finishes</label>
                    {["Champagne Gold", "Rose Gold", "White Gold", "Silver"].map(f => (
                      <label key={f} className="flex items-center gap-2 text-[12px] font-body">
                        <input
                          type="checkbox"
                          checked={newProdFinishes.includes(f)}
                          onChange={(e) => {
                            if (e.target.checked) setNewProdFinishes([...newProdFinishes, f]);
                            else setNewProdFinishes(newProdFinishes.filter(x => x !== f));
                          }}
                        />
                        {f}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-outline/40 pt-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Rating (0-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={newProdRating}
                      onChange={(e) => setNewProdRating(e.target.value)}
                      className="h-11 border border-outline px-4 text-[13px] font-body focus:border-primary outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Review Count</label>
                    <input
                      type="number"
                      value={newProdReviewsCount}
                      onChange={(e) => setNewProdReviewsCount(e.target.value)}
                      className="h-11 border border-outline px-4 text-[13px] font-body focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-6 border-b border-outline/40 pb-4">
                  <label className="flex items-center gap-2 text-[12px] font-body font-semibold">
                    <input type="checkbox" checked={newProdIsBestSeller} onChange={(e) => setNewProdIsBestSeller(e.target.checked)} />
                    Best Seller Badge
                  </label>
                  <label className="flex items-center gap-2 text-[12px] font-body font-semibold">
                    <input type="checkbox" checked={newProdIsNewArrival} onChange={(e) => setNewProdIsNewArrival(e.target.checked)} />
                    New Arrival Badge
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Main Image</label>
                  {existingImages.length > 0 && !newProdMainImage && (
                    <div className="relative w-12 h-12 border border-outline/50 bg-surface mb-2">
                      <Image src={existingImages[0]} alt="Main" fill className="object-cover" />
                    </div>
                  )}
                  {newProdMainImage && (
                    <div className="relative w-12 h-12 border border-outline/50 bg-surface mb-2 group">
                      <Image src={URL.createObjectURL(newProdMainImage)} alt="New Main" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewProdMainImage(null)}
                        className="absolute -top-2 -right-2 bg-error text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Cancel Image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  {!newProdMainImage && (
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setNewProdMainImage(e.target.files[0]);
                        }
                      }}
                      className="h-11 border border-outline px-4 py-2.5 text-[13px] font-body focus:border-primary outline-none"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Secondary Images</label>
                  {existingImages.length > 1 && newProdSecondaryImages.length === 0 && (
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {existingImages.slice(1).map((img, idx) => (
                        <div key={idx} className="relative w-12 h-12 border border-outline/50 bg-surface">
                          <Image src={img} alt={`Secondary ${idx}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  {newProdSecondaryImages.length > 0 && (
                    <div className="flex gap-2 mb-2 flex-wrap items-center">
                      {newProdSecondaryImages.map((file, idx) => (
                        <div key={idx} className="relative w-12 h-12 border border-outline/50 bg-surface">
                          <Image src={URL.createObjectURL(file)} alt={`New Secondary ${idx}`} fill className="object-cover" />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setNewProdSecondaryImages([])}
                        className="flex items-center justify-center bg-error/10 text-error px-2 py-1 rounded font-label-caps text-[9px] hover:bg-error/20 font-bold"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                  {newProdSecondaryImages.length === 0 && (
                    <>
                      <input
                        type="file"
                        multiple
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setNewProdSecondaryImages(Array.from(e.target.files));
                          }
                        }}
                        className="h-11 border border-outline px-4 py-2.5 text-[13px] font-body focus:border-primary outline-none"
                      />
                      <span className="text-[10px] text-on-surface-variant">Choosing new files will replace all existing secondary images.</span>
                    </>
                  )}
                </div>

                <button type="submit" disabled={isUploading} className="w-full bg-primary text-white h-12 font-label-caps text-[11px] tracking-widest uppercase hover:bg-primary-container transition-colors flex items-center justify-center font-bold mt-2 cursor-pointer disabled:opacity-50">
                  {isUploading ? "Processing..." : (editingProductId ? "Update Product" : "Save Product")}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- ORDER DETAIL & ACTIONS MODAL --- */}
      <AnimatePresence>
        {orderModalOpen && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm pointer-events-auto"
              onClick={() => { setOrderModalOpen(false); setSelectedOrder(null); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: "-45%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: "-45%", x: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-1/2 left-1/2 w-full max-w-[680px] bg-white z-50 shadow-2xl overflow-hidden border border-outline/30 flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-outline flex justify-between items-center bg-surface-container-low shrink-0">
                <div>
                  <span className="font-label-caps text-[9px] tracking-widest text-primary font-bold uppercase block">Aurora Luxe Logistics Portal</span>
                  <h3 className="font-display text-[22px] text-on-background font-semibold mt-1">Order Details</h3>
                </div>
                <button
                  onClick={() => { setOrderModalOpen(false); setSelectedOrder(null); }}
                  className="text-on-surface-variant hover:text-primary p-2 border border-outline rounded-full cursor-pointer"
                >
                  <X size={16} className="stroke-[1.5]" />
                </button>
              </div>

              <div className="flex-grow p-6 space-y-6 overflow-y-auto font-body text-[13px] text-on-background">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4 bg-surface p-4 border border-outline/25">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Order Reference ID</div>
                    <div className="font-semibold text-[14px] mt-1 text-on-background">{selectedOrder.orderNumber || selectedOrder.id}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Order Date & Time</div>
                    <div className="font-semibold text-[14px] mt-1 text-on-background">{formatDateTime(selectedOrder.createdAt)}</div>
                  </div>
                </div>

                {/* Grid info customer and address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface-container-low/20 border border-outline/15 p-4 space-y-3">
                    <h4 className="font-display font-bold text-[14px] text-primary border-b border-outline/20 pb-2">Customer Profile</h4>
                    <div className="space-y-1.5 text-[12px] leading-relaxed">
                      <div><strong className="text-on-surface-variant">Name:</strong> {selectedOrder.customerName || `${selectedOrder.user?.firstName || ''} ${selectedOrder.user?.lastName || ''}`.trim() || 'N/A'}</div>
                      <div><strong className="text-on-surface-variant">Email:</strong> {selectedOrder.customerEmail || selectedOrder.user?.email || 'N/A'}</div>
                      <div><strong className="text-on-surface-variant">Phone:</strong> {selectedOrder.customerPhone || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="bg-surface-container-low/20 border border-outline/15 p-4 space-y-3">
                    <h4 className="font-display font-bold text-[14px] text-primary border-b border-outline/20 pb-2">Shipping Destination</h4>
                    <div className="space-y-1.5 text-[12px] leading-relaxed">
                      {selectedOrder.shippingAddress && typeof selectedOrder.shippingAddress === 'object' ? (
                        <>
                          <div><strong>Street:</strong> {selectedOrder.shippingAddress.street || selectedOrder.shippingAddress.address || 'N/A'}</div>
                          <div><strong>City:</strong> {selectedOrder.shippingAddress.city || 'N/A'}</div>
                          <div><strong>State:</strong> {selectedOrder.shippingAddress.state || 'N/A'}</div>
                          <div><strong>Country/Pincode:</strong> {selectedOrder.shippingAddress.country || 'India'} - {selectedOrder.shippingAddress.pincode || 'N/A'}</div>
                        </>
                      ) : (
                        <div className="italic text-on-surface-variant">Address information not stored in structured format.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Products list summary */}
                <div className="space-y-3">
                  <h4 className="font-display font-bold text-[14px] text-primary border-b border-outline/25 pb-2">Jewelry Items Included</h4>
                  <div className="divide-y divide-outline/15 border border-outline/15 bg-white">
                    {selectedOrder.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-surface-container-lowest transition-colors">
                        <div className="relative w-10 h-10 overflow-hidden bg-surface border border-outline/20 shrink-0">
                          <Image src={item.product?.images?.[0]?.url || item.product?.imageUrl || '/hero_model.png'} alt={item.product?.name} fill className="object-cover" />
                        </div>
                        <div className="flex-grow">
                          <div className="font-semibold text-[13px]">{item.product?.name || "Jewelry Item"}</div>
                          <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">SKU: {item.product?.sku || "N/A"}</div>
                        </div>
                        <div className="text-[12px] text-on-surface-variant shrink-0 font-medium">Qty: <span className="font-bold text-on-background">{item.quantity}</span></div>
                        <div className="text-right text-[13px] font-semibold shrink-0 min-w-[70px]">₹{Number(item.price).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtotals & Payment Mode */}
                <div className="bg-surface p-4 border border-outline/25 grid grid-cols-2 gap-4 items-center">
                  <div className="text-[12px] leading-relaxed">
                    <div><strong className="text-on-surface-variant">Payment Method:</strong> {selectedOrder.payment?.method || 'Cash on Delivery'}</div>
                    <div><strong className="text-on-surface-variant">Initial Payment Status:</strong> {selectedOrder.payment?.status || 'PENDING'}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-caps text-[9px] uppercase tracking-wider text-on-surface-variant">Grand Total Billing</span>
                    <div className="text-[20px] font-bold text-primary mt-1">₹{Number(selectedOrder.totalAmount).toLocaleString()}</div>
                  </div>
                </div>

                {/* Admin update details form */}
                <form onSubmit={handleUpdateOrderDetails} className="space-y-4 border-t border-outline/30 pt-5 shrink-0">
                  <h4 className="font-display font-bold text-[14px] text-primary">Logistics & Operations Action</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Shipping Status Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[9px] tracking-widest text-on-surface-variant font-bold uppercase">Shipping Status</label>
                      <select
                        value={modalShippingStatus}
                        onChange={(e) => setModalShippingStatus(e.target.value)}
                        className="h-10 border border-outline px-3 text-[12px] font-body outline-none focus:border-primary bg-white"
                      >
                        <option value="PENDING">Pending (Not Processed)</option>
                        <option value="PROCESSING">Processing (Packaging)</option>
                        <option value="SHIPPED">Shipped (Dispatched)</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>

                    {/* Payment Status Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[9px] tracking-widest text-on-surface-variant font-bold uppercase">Payment Status</label>
                      <select
                        value={modalPaymentStatus}
                        onChange={(e) => setModalPaymentStatus(e.target.value)}
                        className="h-10 border border-outline px-3 text-[12px] font-body outline-none focus:border-primary bg-white"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="SUCCESS">Success (Paid)</option>
                        <option value="FAILED">Failed</option>
                        <option value="REFUNDED">Refunded</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tracking ID Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[9px] tracking-widest text-on-surface-variant font-bold uppercase">AWB/Tracking ID</label>
                      <input
                        type="text"
                        value={modalTrackingId}
                        onChange={(e) => setModalTrackingId(e.target.value)}
                        placeholder="e.g. AWB18239201"
                        className="h-10 border border-outline px-3 text-[12px] font-body outline-none focus:border-primary"
                      />
                    </div>

                    {/* Quick Admin Actions */}
                    <div className="flex gap-2 items-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Are you sure you want to cancel this order?")) {
                            setModalShippingStatus("CANCELLED");
                          }
                        }}
                        className="flex-1 h-10 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[11px] font-label-caps tracking-widest uppercase transition-colors cursor-pointer font-bold"
                      >
                        Cancel Order
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm("Resend order confirmation email notification?")) {
                            try {
                              await api.post(`/orders/${selectedOrder.id}/notify`);
                              alert("Email notifications triggered successfully!");
                            } catch (e) {
                              alert("Failed to send email notifications");
                            }
                          }
                        }}
                        className="flex-1 h-10 border border-outline bg-white hover:bg-surface text-on-background text-[11px] font-label-caps tracking-widest uppercase transition-colors cursor-pointer font-bold"
                      >
                        Send Email Alert
                      </button>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[9px] tracking-widest text-on-surface-variant font-bold uppercase">Internal Note (Private)</label>
                    <textarea
                      value={modalAdminNotes}
                      onChange={(e) => setModalAdminNotes(e.target.value)}
                      placeholder="Add private log comments..."
                      className="h-16 border border-outline p-3 text-[12px] font-body outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={modalUpdating}
                    className="w-full bg-on-background text-white h-12 font-label-caps text-[11px] tracking-widest uppercase hover:bg-primary transition-colors flex items-center justify-center font-bold disabled:opacity-50 cursor-pointer"
                  >
                    {modalUpdating ? "Saving updates..." : "Save Log Changes"}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product deletion confirmation modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm pointer-events-auto"
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-1/2 left-1/2 w-full max-w-[420px] bg-white z-50 shadow-2xl p-8 border border-outline/30 text-center"
            >
              <div className="flex justify-center mb-4 text-error">
                <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                  <X size={24} className="stroke-[1.5]" />
                </div>
              </div>

              <h3 className="font-display text-[22px] text-on-background font-semibold mb-2">Delete Design?</h3>
              <p className="font-body text-[13px] text-on-surface-variant font-light mb-8 leading-relaxed">
                Are you sure you want to remove this piece from the inventory? This action is permanent and cannot be undone.
              </p>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 h-12 border border-outline font-label-caps text-[11px] tracking-widest uppercase hover:bg-surface transition-colors cursor-pointer font-bold text-on-background bg-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(deleteConfirmId)}
                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-label-caps text-[11px] tracking-widest uppercase transition-colors cursor-pointer font-bold"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </main>
  );
}
