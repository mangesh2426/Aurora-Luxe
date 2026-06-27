"use client";
import { useState, useEffect, useRef } from "react";
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
  FileText,
  Menu,
  ChevronLeft,
  Bell,
  MessageSquare,
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Command,
  ArrowRight,
  Trash2,
  Upload,
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api, { mapBackendProduct } from "@/lib/api";

export default function AdminPage() {
  const { user, login, logout } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Authentication Portal States
  const [portalEmail, setPortalEmail] = useState("admin@auroraluxe.com");
  const [portalPassword, setPortalPassword] = useState("admin123");
  const [portalError, setPortalError] = useState("");
  const [portalLoading, setPortalLoading] = useState(false);

  // Layout States
  const [activePanel, setActivePanel] = useState<"overview" | "products" | "orders" | "customers">("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Data States
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
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
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");

  // Order Details Modal States
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [modalShippingStatus, setModalShippingStatus] = useState("PENDING");
  const [modalPaymentStatus, setModalPaymentStatus] = useState("PENDING");
  const [modalTrackingId, setModalTrackingId] = useState("");
  const [modalAdminNotes, setModalAdminNotes] = useState("");
  const [modalUpdating, setModalUpdating] = useState(false);

  // Search & Filters
  const [orderSearchText, setOrderSearchText] = useState("");
  const [orderPaymentFilter, setOrderPaymentFilter] = useState("ALL");
  const [orderShippingFilter, setOrderShippingFilter] = useState("ALL");
  const [orderDateFilter, setOrderDateFilter] = useState("ALL");
  const [orderCustomStartDate, setOrderCustomStartDate] = useState("");
  const [orderCustomEndDate, setOrderCustomEndDate] = useState("");

  const [inventorySearchText, setInventorySearchText] = useState("");
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState("ALL");
  const [inventoryStockFilter, setInventoryStockFilter] = useState("ALL");
  const [inventorySort, setInventorySort] = useState("NEWEST");

  // Command Menu Search Query
  const [commandQuery, setCommandQuery] = useState("");

  // Refs for Drag & Drop Resizing
  const isResizingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    // Keyboard listener for Cmd/Ctrl + K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    setAutoSaveStatus("saving");

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

      setAutoSaveStatus("saved");
      setProductModalOpen(false);
    } catch (e) {
      console.error(e);
      setAutoSaveStatus("unsaved");
      alert(`Failed to ${editingProductId ? "update" : "add"} product`);
    } finally {
      setIsUploading(false);
    }
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

  // Date and Time Helper formatting
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

  // Filter lists
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

  // Drag resizing handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const newWidth = Math.max(180, Math.min(380, e.clientX));
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-[80px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#7C3AED] mx-auto mb-4 stroke-[1.5]" />
          <p className="font-body text-[11px] text-gray-500 uppercase tracking-[0.2em] font-semibold">Verifying Portal Access...</p>
        </div>
      </main>
    );
  }

  // Authentication Portal Screen Redesign (Premium Glass Card)
  if (mounted && user?.role !== "admin") {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6 py-24 pt-[120px] relative overflow-hidden">
        {/* Subtle blur background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="w-full max-w-[460px] bg-white border border-[#E5E7EB] p-12 rounded-3xl shadow-luxury relative z-10"
        >
          <div className="text-center mb-10">
            <span className="font-body text-[10px] text-[#7C3AED] tracking-[0.3em] uppercase block mb-3 font-semibold">Aurora Luxe Control Hub</span>
            <h1 className="font-display text-[36px] text-gray-900 leading-tight font-light">Admin Portal</h1>
            <p className="font-body text-[13px] text-gray-500 font-light mt-2">Authentication required for workspace access.</p>
          </div>

          <form onSubmit={handlePortalSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-email" className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Admin Email</label>
              <input
                type="email"
                id="admin-email"
                value={portalEmail}
                onChange={(e) => setPortalEmail(e.target.value)}
                className="w-full h-12 bg-gray-50/50 border border-[#E5E7EB] focus:border-[#7C3AED] focus:bg-white rounded-xl px-4 transition-all font-body text-[14px] text-gray-900 placeholder-gray-400 outline-none"
                placeholder="admin@email.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="admin-password" className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Secret Key / Password</label>
              <input
                type="password"
                id="admin-password"
                value={portalPassword}
                onChange={(e) => setPortalPassword(e.target.value)}
                className="w-full h-12 bg-gray-50/50 border border-[#E5E7EB] focus:border-[#7C3AED] focus:bg-white rounded-xl px-4 transition-all font-body text-[14px] text-gray-900 placeholder-gray-400 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {portalError && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600"
              >
                <AlertCircle size={14} className="shrink-0" />
                <span className="text-[12px] font-medium">{portalError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={portalLoading}
              className="w-full h-13 bg-gray-900 text-white rounded-xl font-label-caps text-[11px] tracking-widest uppercase hover:bg-[#7C3AED] transition-all flex items-center justify-center relative disabled:opacity-50 cursor-pointer font-semibold shadow-sm hover:shadow-md"
            >
              {portalLoading ? (
                <Loader2 className="animate-spin text-white" size={16} />
              ) : (
                <span>Unlock Console</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-[#E5E7EB] flex justify-between items-center">
            <Link href="/" className="font-label-caps text-[10px] tracking-widest uppercase text-gray-500 hover:text-gray-900 transition-colors font-medium">
              &larr; Back to Store
            </Link>
            <span className="font-body text-[10px] text-gray-400 italic">Secure Sandbox v1.0</span>
          </div>
        </motion.div>
      </main>
    );
  }

  // Define sidebar navigation items
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "products", label: "Inventory", icon: Gem },
    { id: "orders", label: "Orders Log", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users }
  ];

  // Command Menu Match List
  const commandResults = [
    ...sidebarItems.map(item => ({ type: "Navigation", name: `Go to ${item.label}`, action: () => { setActivePanel(item.id as any); setCommandPaletteOpen(false); } })),
    { type: "Action", name: "Add Jewelry Item", action: () => { handleOpenCreateModal(); setCommandPaletteOpen(false); } },
    { type: "Action", name: "Export Orders to CSV", action: () => { handleExportCSV(); setCommandPaletteOpen(false); } },
    { type: "Action", name: "Toggle Premium Dark Mode", action: () => { setIsDarkMode(prev => !prev); setCommandPaletteOpen(false); } },
    { type: "Action", name: "Exit Hub Control Console", action: () => { logout(); localStorage.removeItem("aurora_user_session"); setCommandPaletteOpen(false); } }
  ].filter(c => c.name.toLowerCase().includes(commandQuery.toLowerCase()));

  const activePageLabel = sidebarItems.find(i => i.id === activePanel)?.label || "Overview";

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex w-full pt-[80px] overflow-hidden text-gray-900 dark:text-gray-100 transition-colors duration-300">
        
        {/* === SIDEBAR LAYOUT === */}
        <aside 
          style={{ width: sidebarCollapsed ? 76 : sidebarWidth }}
          className="hidden md:flex flex-col bg-white dark:bg-[#111111] border-r border-[#E5E7EB] dark:border-zinc-800 shrink-0 relative transition-all duration-300 z-30"
        >
          {/* Resize handle */}
          {!sidebarCollapsed && (
            <div 
              onMouseDown={handleMouseDown}
              className="absolute top-0 right-0 w-[4px] h-full cursor-col-resize hover:bg-[#7C3AED]/20 transition-colors active:bg-[#7C3AED]/40" 
            />
          )}

          {/* Sidebar Header */}
          <div className="h-16 px-6 border-b border-[#E5E7EB] dark:border-zinc-800 flex items-center justify-between overflow-hidden bg-white dark:bg-[#111111]">
            {!sidebarCollapsed ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display text-[18px] text-[#7C3AED] tracking-[0.2em] font-light flex items-center gap-2 truncate"
              >
                AURORA <span className="font-semibold text-gray-900 dark:text-white tracking-[0.1em]">LUXE</span>
              </motion.div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
                <Sparkles size={14} className="text-[#7C3AED]" />
              </div>
            )}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-400 dark:text-zinc-500 cursor-pointer hidden md:block"
            >
              <ChevronLeft size={16} className={`transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-grow py-6 px-3 space-y-1.5 overflow-y-auto">
            {sidebarItems.map(item => {
              const IconComponent = item.icon;
              const isActive = activePanel === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 text-[12px] font-label-caps tracking-widest uppercase rounded-xl transition-all cursor-pointer relative group ${
                    isActive 
                      ? "text-[#7C3AED] font-semibold bg-[#7C3AED]/5 dark:bg-[#7C3AED]/10" 
                      : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  <IconComponent size={18} className={`stroke-[1.5] transition-transform duration-300 group-hover:scale-105 ${isActive ? "text-[#7C3AED]" : ""}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  
                  {/* Glowing active edge dot */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeGlow"
                      className="absolute right-3 w-1.5 h-1.5 bg-[#7C3AED] rounded-full shadow-[0_0_8px_#7C3AED]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer / Signout */}
          <div className="p-4 border-t border-[#E5E7EB] dark:border-zinc-800 bg-white dark:bg-[#111111]">
            <button
              onClick={() => {
                logout();
                localStorage.removeItem("aurora_user_session");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-label-caps tracking-widest uppercase rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-all duration-300 font-semibold truncate"
            >
              <X size={16} className="stroke-[1.5] shrink-0" />
              {!sidebarCollapsed && <span>Exit Hub</span>}
            </button>
          </div>
        </aside>

        {/* === MAIN CONTAINER === */}
        <div className="flex-grow flex flex-col min-w-0">
          
          {/* === TOP STICKY HEADER === */}
          <header className="h-16 bg-white/80 dark:bg-[#09090B]/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-zinc-800 flex items-center justify-between px-6 md:px-8 sticky top-[80px] z-20 transition-all duration-300">
            {/* Left Header Info */}
            <div className="flex items-center gap-4">
              {/* Mobile Sidebar Trigger */}
              <button className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400">
                <Menu size={20} />
              </button>
              
              {/* Breadcrumb Navigation */}
              <nav className="hidden sm:flex items-center gap-2 font-body text-[12px] text-gray-500 dark:text-zinc-400">
                <span>Console</span>
                <ChevronRight size={12} className="text-gray-300 dark:text-zinc-600" />
                <span className="text-gray-900 dark:text-white font-medium">{activePageLabel}</span>
              </nav>
            </div>

            {/* Right Header Navigation Group */}
            <div className="flex items-center gap-3">
              
              {/* Premium Command Input Button */}
              <button 
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden md:flex items-center gap-3 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-[#E5E7EB] dark:border-zinc-800 text-gray-400 dark:text-zinc-500 px-4 py-2 rounded-xl text-[12px] font-body transition-colors cursor-pointer w-48 lg:w-64 text-left"
              >
                <Search size={14} className="stroke-[1.5]" />
                <span className="flex-grow font-light">Search console...</span>
                <kbd className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-1.5 py-0.5 rounded text-[10px] tracking-tighter shrink-0 flex items-center gap-0.5 shadow-sm font-semibold">
                  <Command size={8} />K
                </kbd>
              </button>

              {/* Messages Trigger */}
              <div className="relative">
                <button 
                  onClick={() => setMessageOpen(!messageOpen)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl text-gray-500 dark:text-zinc-400 transition-colors cursor-pointer"
                >
                  <MessageSquare size={18} className="stroke-[1.5]" />
                </button>
                
                {/* Messages Dropdown */}
                <AnimatePresence>
                  {messageOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-zinc-800 shadow-luxury rounded-2xl p-6 z-50 text-left"
                    >
                      <h4 className="font-display font-semibold text-[15px] border-b border-[#E5E7EB] dark:border-zinc-800 pb-3 mb-3 text-gray-900 dark:text-white">Messages</h4>
                      <p className="text-[12px] text-gray-400 dark:text-zinc-500 py-4 text-center italic">No new customer messages received.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications Trigger */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl text-gray-500 dark:text-zinc-400 transition-colors cursor-pointer relative"
                >
                  <Bell size={18} className="stroke-[1.5]" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7C3AED] rounded-full shadow-[0_0_6px_#7C3AED]" />
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {notificationOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-zinc-800 shadow-luxury rounded-2xl p-6 z-50 text-left"
                    >
                      <h4 className="font-display font-semibold text-[15px] border-b border-[#E5E7EB] dark:border-zinc-800 pb-3 mb-3 text-gray-900 dark:text-white">Recent Alerts</h4>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#7C3AED] mt-1.5 shrink-0" />
                          <div>
                            <p className="text-[12px] text-gray-800 dark:text-zinc-300 font-medium">New order received from client Guest</p>
                            <span className="text-[10px] text-gray-400 dark:text-zinc-500">10 minutes ago</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <div>
                            <p className="text-[12px] text-gray-800 dark:text-zinc-300 font-medium">Payout completed successfully</p>
                            <span className="text-[10px] text-gray-400 dark:text-zinc-500">1 hour ago</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark Mode Toggle */}
              <button 
                onClick={() => setIsDarkMode(prev => !prev)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl text-gray-500 dark:text-zinc-400 transition-colors cursor-pointer"
              >
                {isDarkMode ? <Sun size={18} className="stroke-[1.5]" /> : <Moon size={18} className="stroke-[1.5]" />}
              </button>

              <div className="h-6 w-[1px] bg-[#E5E7EB] dark:zinc-800 mx-1 hidden sm:block" />

              {/* Profile Menu Trigger */}
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#7C3AED]/10 flex items-center justify-center shrink-0 border border-outline">
                    <span className="font-display text-[13px] text-[#7C3AED] font-semibold">AD</span>
                  </div>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-zinc-800 shadow-luxury rounded-2xl p-4 z-50 text-left"
                    >
                      <div className="border-b border-[#E5E7EB] dark:border-zinc-800 pb-3 mb-3">
                        <p className="text-[12px] font-bold text-gray-800 dark:text-zinc-300">{user?.name || "Administrator"}</p>
                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 truncate mt-0.5">{user?.email}</p>
                      </div>
                      <Link 
                        href="/"
                        className="block w-full text-left py-2 px-2 text-[11px] font-label-caps tracking-widest uppercase hover:bg-gray-50 dark:hover:bg-zinc-800/40 rounded-lg text-gray-500 hover:text-gray-900"
                      >
                        Storefront
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          localStorage.removeItem("aurora_user_session");
                        }}
                        className="block w-full text-left py-2 px-2 text-[11px] font-label-caps tracking-widest uppercase hover:bg-red-50 dark:hover:bg-red-950/10 rounded-lg text-red-500 font-semibold"
                      >
                        Exit Hub
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </header>

          {/* === CONTENT CONTAINER === */}
          <div className="flex-grow p-6 md:p-8 space-y-8 overflow-y-auto">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E7EB] dark:border-zinc-800 pb-6">
              <div>
                <h1 className="font-display text-[32px] md:text-[38px] text-gray-900 dark:text-white leading-tight font-light flex items-center gap-3">
                  {activePageLabel}
                </h1>
                <p className="font-body text-[12px] text-gray-500 dark:text-zinc-400 font-light mt-1">
                  Secure SaaS Hub &bull; Live database sync OK
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link href="/" className="px-5 py-2.5 border border-[#E5E7EB] dark:border-zinc-800 text-[11px] font-label-caps uppercase tracking-widest bg-white dark:bg-zinc-900 hover:bg-gray-50 rounded-xl transition-all font-semibold shadow-sm text-center w-full sm:w-auto">
                  View Storefront
                </Link>
                {activePanel === "products" && (
                  <button
                    onClick={handleOpenCreateModal}
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-label-caps text-[11px] tracking-widest uppercase hover:bg-[#7C3AED] hover:text-white transition-all flex items-center justify-center gap-2 font-semibold shadow-sm w-full sm:w-auto cursor-pointer"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                )}
              </div>
            </div>

            {/* === PANEL 1: OVERVIEW SUMMARY === */}
            <AnimatePresence mode="wait">
              {activePanel === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  {/* KPI stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Stat Card 1 */}
                    <div className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 flex flex-col justify-between group hover:border-[#7C3AED]/30 transition-all duration-300 relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.08),transparent_70%)]" />
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-[9px] tracking-widest text-gray-500 uppercase font-semibold">Total Revenue</span>
                        <div className="p-2 bg-[#7C3AED]/5 rounded-xl text-[#7C3AED]">
                          <DollarSign size={18} className="stroke-[1.5]" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <div className="font-display text-[26px] font-medium leading-none">₹{(dashboardStats?.revenue || 0).toLocaleString()}</div>
                          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold mt-2">
                            <TrendingUp size={12} />
                            <span>+12.4%</span>
                            <span className="text-gray-400 font-light font-body">from last month</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 flex flex-col justify-between group hover:border-[#7C3AED]/30 transition-all duration-300 relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.08),transparent_70%)]" />
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-[9px] tracking-widest text-gray-500 uppercase font-semibold">Orders Today</span>
                        <div className="p-2 bg-[#7C3AED]/5 rounded-xl text-[#7C3AED]">
                          <Calendar size={18} className="stroke-[1.5]" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <div className="font-display text-[26px] font-medium leading-none">{dashboardStats?.ordersToday || 0}</div>
                          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold mt-2">
                            <TrendingUp size={12} />
                            <span>+4.2%</span>
                            <span className="text-gray-400 font-light font-body">vs average</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 flex flex-col justify-between group hover:border-[#7C3AED]/30 transition-all duration-300 relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.08),transparent_70%)]" />
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-[9px] tracking-widest text-gray-500 uppercase font-semibold">Pending Orders</span>
                        <div className="p-2 bg-[#7C3AED]/5 rounded-xl text-[#7C3AED]">
                          <Clock size={18} className="stroke-[1.5]" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <div className="font-display text-[26px] font-medium leading-none text-[#F59E0B]">{dashboardStats?.pendingOrders || 0}</div>
                          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-light mt-2">
                            <span>Awaiting dispatch logs</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 flex flex-col justify-between group hover:border-[#7C3AED]/30 transition-all duration-300 relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.08),transparent_70%)]" />
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-[9px] tracking-widest text-gray-500 uppercase font-semibold">Delivered Orders</span>
                        <div className="p-2 bg-[#7C3AED]/5 rounded-xl text-[#7C3AED]">
                          <ShoppingBag size={18} className="stroke-[1.5]" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <div className="font-display text-[26px] font-medium leading-none text-[#22C55E]">{dashboardStats?.deliveredOrders || 0}</div>
                          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold mt-2">
                            <TrendingUp size={12} />
                            <span>+8.9%</span>
                            <span className="text-gray-400 font-light font-body">fulfilled rate</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Secondary stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 flex items-center justify-between shadow-sm hover:border-[#7C3AED]/20 transition-all">
                      <div>
                        <span className="font-label-caps text-[9px] tracking-widest text-gray-500 uppercase font-semibold">Cancelled Orders</span>
                        <div className="font-display text-[22px] font-medium mt-1.5">{dashboardStats?.cancelledOrders || 0}</div>
                      </div>
                      <AlertCircle size={20} className="text-red-500 stroke-[1.5]" />
                    </div>
                    <div className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 flex items-center justify-between shadow-sm hover:border-[#7C3AED]/20 transition-all">
                      <div>
                        <span className="font-label-caps text-[9px] tracking-widest text-gray-500 uppercase font-semibold">Live Inventory</span>
                        <div className="font-display text-[22px] font-medium mt-1.5">{dashboardStats?.liveInventory || 0} units</div>
                      </div>
                      <Tag size={20} className="text-[#7C3AED] stroke-[1.5]" />
                    </div>
                    <div className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 flex items-center justify-between shadow-sm hover:border-[#7C3AED]/20 transition-all">
                      <div>
                        <span className="font-label-caps text-[9px] tracking-widest text-gray-500 uppercase font-semibold">Low Stock Products</span>
                        <div className="font-display text-[22px] font-medium mt-1.5 text-amber-600 dark:text-amber-500">{dashboardStats?.lowStockProducts || 0} items</div>
                      </div>
                      <Gem size={20} className="text-amber-500 stroke-[1.5]" />
                    </div>
                    <div className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 flex items-center justify-between shadow-sm hover:border-[#7C3AED]/20 transition-all">
                      <div>
                        <span className="font-label-caps text-[9px] tracking-widest text-gray-500 uppercase font-semibold">Unique Customers</span>
                        <div className="font-display text-[22px] font-medium mt-1.5">{dashboardStats?.usersCount || 0}</div>
                      </div>
                      <Users size={20} className="text-primary dark:text-[#7C3AED] stroke-[1.5]" />
                    </div>
                  </div>

                  {/* Activity timestamps */}
                  <div className="text-[11px] text-gray-500 dark:text-zinc-400 font-light flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-[#18181B] px-6 py-4 rounded-xl border border-[#E5E7EB] dark:border-zinc-800 gap-2">
                    <div>Console Last Refreshed: <span className="font-semibold text-gray-800 dark:text-white">{formatDateTime(dashboardStats?.lastUpdated)}</span></div>
                    <div>Latest System Action: <span className="font-semibold text-gray-800 dark:text-white">{formatDateTime(dashboardStats?.latestOrderTime)}</span></div>
                  </div>

                  {/* Transactions Table Redesign (Premium Glass Block) */}
                  <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-6 py-5 border-b border-[#E5E7EB] dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/40">
                      <h3 className="font-display text-[18px] text-gray-900 dark:text-white font-semibold">Recent Transactions</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[13px] border-collapse">
                        <thead>
                          <tr className="border-b border-[#E5E7EB] dark:border-zinc-800 font-label-caps text-[9px] tracking-widest uppercase text-gray-400">
                            <th className="p-4 pl-6">Order ID</th>
                            <th className="p-4">Date & Time</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Payment</th>
                            <th className="p-4">Shipping Status</th>
                            <th className="p-4 text-right">Total Billing</th>
                            <th className="p-4 pr-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB] dark:divide-zinc-800 font-body text-gray-700 dark:text-zinc-300">
                          {loadingStats ? (
                            <tr>
                              <td colSpan={7} className="p-12 text-center">
                                <Loader2 className="animate-spin text-[#7C3AED] mx-auto" size={24} />
                              </td>
                            </tr>
                          ) : dashboardStats?.recentOrders?.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-12 text-center text-gray-400 dark:text-zinc-500 italic">
                                No transaction logs available.
                              </td>
                            </tr>
                          ) : (
                            dashboardStats?.recentOrders?.map((o: any) => (
                              <tr key={o.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                                <td className="p-4 pl-6 font-semibold text-gray-900 dark:text-white">{o.orderNumber || o.id.substring(0, 8)}</td>
                                <td className="p-4 text-[12px]">{formatDateTime(o.createdAt)}</td>
                                <td className="p-4 font-medium text-gray-900 dark:text-white">{o.customerName || `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.trim() || 'Guest'}</td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border ${
                                    (o.paymentStatus || 'PENDING') === 'SUCCESS' 
                                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30" 
                                      : (o.paymentStatus || 'PENDING') === 'PENDING' 
                                        ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30" 
                                        : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30"
                                  }`}>{o.paymentStatus || "PENDING"}</span>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border uppercase ${
                                    (o.shippingStatus || 'PENDING') === 'DELIVERED' 
                                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30" 
                                      : (o.shippingStatus || 'PENDING') === 'CANCELLED' 
                                        ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30" 
                                        : (o.shippingStatus || 'PENDING') === 'SHIPPED' 
                                          ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30" 
                                          : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30"
                                  }`}>{o.shippingStatus || "PENDING"}</span>
                                </td>
                                <td className="p-4 text-right font-semibold text-gray-900 dark:text-white">₹{Number(o.totalAmount).toLocaleString()}</td>
                                <td className="p-4 pr-6 text-right">
                                  <button
                                    onClick={() => handleOpenOrderDetails(o)}
                                    className="text-[#7C3AED] hover:underline text-[12px] font-semibold cursor-pointer bg-transparent border-none outline-none"
                                  >
                                    View
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

              {/* === PANEL 2: PRODUCT INVENTORY === */}
              {activePanel === "products" && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* Filters Bar */}
                  <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-zinc-800 rounded-2xl p-6 flex flex-col lg:flex-row items-center gap-5 shadow-sm">
                    {/* Search */}
                    <div className="w-full lg:flex-grow relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                        <Search size={16} />
                      </span>
                      <input
                        type="text"
                        placeholder="Search products by SKU, name, or design..."
                        value={inventorySearchText}
                        onChange={(e) => setInventorySearchText(e.target.value)}
                        className="w-full h-11 border border-[#E5E7EB] dark:border-zinc-800 rounded-xl pl-10 pr-4 text-[13px] font-body focus:border-[#7C3AED] dark:focus:border-[#7C3AED] outline-none bg-gray-50/50 dark:bg-zinc-900/40 text-gray-900 dark:text-white transition-all"
                      />
                    </div>

                    {/* Filters dropdown list */}
                    <div className="w-full lg:w-auto flex flex-wrap sm:flex-nowrap gap-4 items-center shrink-0">
                      <div className="w-full sm:w-[160px] flex flex-col gap-1.5">
                        <span className="font-label-caps text-[8px] tracking-widest text-gray-400 font-bold uppercase">Category</span>
                        <select
                          value={inventoryCategoryFilter}
                          onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                          className="h-10 border border-[#E5E7EB] dark:border-zinc-800 rounded-lg px-3 text-[12px] font-body outline-none focus:border-[#7C3AED] bg-white dark:bg-[#18181B] text-gray-900 dark:text-white"
                        >
                          <option value="ALL">All Categories</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="w-full sm:w-[150px] flex flex-col gap-1.5">
                        <span className="font-label-caps text-[8px] tracking-widest text-gray-400 font-bold uppercase">Stock Levels</span>
                        <select
                          value={inventoryStockFilter}
                          onChange={(e) => setInventoryStockFilter(e.target.value)}
                          className="h-10 border border-[#E5E7EB] dark:border-zinc-800 rounded-lg px-3 text-[12px] font-body outline-none focus:border-[#7C3AED] bg-white dark:bg-[#18181B] text-gray-900 dark:text-white"
                        >
                          <option value="ALL">All Levels</option>
                          <option value="INSTOCK">In Stock (&gt;10)</option>
                          <option value="LOWSTOCK">Low Stock (1-10)</option>
                          <option value="OUTOFSTOCK">Out of Stock (0)</option>
                        </select>
                      </div>

                      <div className="w-full sm:w-[160px] flex flex-col gap-1.5">
                        <span className="font-label-caps text-[8px] tracking-widest text-gray-400 font-bold uppercase">Sorting</span>
                        <select
                          value={inventorySort}
                          onChange={(e) => setInventorySort(e.target.value)}
                          className="h-10 border border-[#E5E7EB] dark:border-zinc-800 rounded-lg px-3 text-[12px] font-body outline-none focus:border-[#7C3AED] bg-white dark:bg-[#18181B] text-gray-900 dark:text-white"
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

                  {/* Inventory Table Design */}
                  <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[13px] border-collapse">
                        <thead>
                          <tr className="border-b border-[#E5E7EB] dark:border-zinc-800 font-label-caps text-[9px] tracking-widest uppercase text-gray-400">
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
                        <tbody className="divide-y divide-[#E5E7EB] dark:divide-zinc-800 font-body text-gray-700 dark:text-zinc-300">
                          {loadingProducts ? (
                            <tr>
                              <td colSpan={9} className="p-12 text-center">
                                <Loader2 className="animate-spin text-[#7C3AED] mx-auto" size={24} />
                              </td>
                            </tr>
                          ) : filteredProducts.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="p-12 text-center text-gray-400 dark:text-zinc-500 italic bg-gray-50/10">
                                No items found matching selection rules.
                              </td>
                            </tr>
                          ) : filteredProducts.map(p => {
                            const stockVal = p.originalStock || 0;
                            let statusColor = "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30";
                            let statusText = "In Stock";

                            if (stockVal === 0) {
                              statusColor = "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30";
                              statusText = "Out of Stock";
                            } else if (stockVal <= 10) {
                              statusColor = "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30";
                              statusText = "Low Stock";
                            }

                            return (
                              <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                                <td className="p-4 pl-6">
                                  <div className="relative w-11 h-11 overflow-hidden rounded-lg bg-gray-50 dark:bg-zinc-800 border border-[#E5E7EB] dark:border-zinc-700 shadow-inner">
                                    <Image src={p.imageUrl || '/hero_model.png'} alt={p.name} fill className="object-cover" />
                                  </div>
                                </td>
                                <td className="p-4 font-semibold text-gray-900 dark:text-white leading-normal">{p.name}</td>
                                <td className="p-4 font-mono text-[11px] text-gray-400 dark:text-zinc-500">{p.sku || "N/A"}</td>
                                <td className="p-4">{p.category}</td>
                                <td className="p-4 text-center font-semibold">{stockVal}</td>
                                <td className="p-4 text-right font-medium">₹{p.price.toLocaleString()}</td>
                                <td className="p-4 text-right text-gray-500">
                                  {p.discount ? `${p.discount}% Off` : "None"}
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${statusColor}`}>
                                    {statusText}
                                  </span>
                                </td>
                                <td className="p-4 pr-6 text-right">
                                  <div className="flex items-center justify-end gap-3.5">
                                    <button
                                      onClick={() => handleEditProduct(p)}
                                      className="text-[#7C3AED] hover:underline text-[12px] font-semibold cursor-pointer bg-transparent border-none outline-none"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmId(p.id)}
                                      className="text-red-500 hover:underline text-[12px] font-semibold cursor-pointer bg-transparent border-none outline-none"
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

              {/* === PANEL 3: ORDERS LOG === */}
              {activePanel === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                    <div>
                      <h3 className="font-display text-[22px] text-on-background font-semibold">Operations Registry</h3>
                      <p className="font-body text-[12px] text-gray-500 dark:text-zinc-400 font-light mt-1">Configure shipping, track invoices, and map orders status.</p>
                    </div>
                    <button
                      onClick={handleExportCSV}
                      className="border border-[#E5E7EB] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-800 dark:text-white px-5 py-2.5 rounded-xl font-label-caps text-[10px] tracking-widest uppercase hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all flex items-center gap-2 font-semibold shadow-sm cursor-pointer shrink-0"
                    >
                      <FileSpreadsheet size={16} /> Export CSV
                    </button>
                  </div>

                  {/* Filters Panel */}
                  <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                      <div className="lg:col-span-2 relative w-full">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                          <Search size={16} />
                        </span>
                        <input
                          type="text"
                          placeholder="Search orders by ID, Client name, email, or contact..."
                          value={orderSearchText}
                          onChange={(e) => setOrderSearchText(e.target.value)}
                          className="w-full h-11 border border-[#E5E7EB] dark:border-zinc-800 rounded-xl pl-10 pr-4 text-[13px] font-body focus:border-[#7C3AED] outline-none bg-gray-50/50 dark:bg-zinc-900/40 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-label-caps text-[8px] tracking-widest text-gray-400 font-bold uppercase">Payment State</span>
                        <select
                          value={orderPaymentFilter}
                          onChange={(e) => setOrderPaymentFilter(e.target.value)}
                          className="h-10 border border-[#E5E7EB] dark:border-zinc-800 rounded-lg px-3 text-[12px] font-body outline-none focus:border-[#7C3AED] bg-white dark:bg-[#18181B] text-gray-900 dark:text-white"
                        >
                          <option value="ALL">All Payments</option>
                          <option value="PENDING">Pending (COD/Unpaid)</option>
                          <option value="SUCCESS">Success (Paid)</option>
                          <option value="FAILED">Failed</option>
                          <option value="REFUNDED">Refunded</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-label-caps text-[8px] tracking-widest text-gray-400 font-bold uppercase">Shipping Status</span>
                        <select
                          value={orderShippingFilter}
                          onChange={(e) => setOrderShippingFilter(e.target.value)}
                          className="h-10 border border-[#E5E7EB] dark:border-zinc-800 rounded-lg px-3 text-[12px] font-body outline-none focus:border-[#7C3AED] bg-white dark:bg-[#18181B] text-gray-900 dark:text-white"
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

                    <div className="pt-3 border-t border-[#E5E7EB] dark:border-zinc-800 grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-label-caps text-[8px] tracking-widest text-gray-400 font-bold uppercase">Date Range Filter</span>
                        <select
                          value={orderDateFilter}
                          onChange={(e) => setOrderDateFilter(e.target.value)}
                          className="h-10 border border-[#E5E7EB] dark:border-zinc-800 rounded-lg px-3 text-[12px] font-body outline-none focus:border-[#7C3AED] bg-white dark:bg-[#18181B] text-gray-900 dark:text-white"
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
                            <span className="font-label-caps text-[8px] tracking-widest text-gray-400 font-bold uppercase">Start Date</span>
                            <input
                              type="date"
                              value={orderCustomStartDate}
                              onChange={(e) => setOrderCustomStartDate(e.target.value)}
                              className="h-10 border border-[#E5E7EB] dark:border-zinc-800 rounded-lg px-3 text-[12px] font-body outline-none focus:border-[#7C3AED] bg-white dark:bg-[#18181B] text-gray-900 dark:text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="font-label-caps text-[8px] tracking-widest text-gray-400 font-bold uppercase">End Date</span>
                            <input
                              type="date"
                              value={orderCustomEndDate}
                              onChange={(e) => setOrderCustomEndDate(e.target.value)}
                              className="h-10 border border-[#E5E7EB] dark:border-zinc-800 rounded-lg px-3 text-[12px] font-body outline-none focus:border-[#7C3AED] bg-white dark:bg-[#18181B] text-gray-900 dark:text-white"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[13px] border-collapse">
                        <thead>
                          <tr className="border-b border-[#E5E7EB] dark:border-zinc-800 font-label-caps text-[9px] tracking-widest uppercase text-gray-400">
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
                        <tbody className="divide-y divide-[#E5E7EB] dark:divide-zinc-800 font-body text-gray-700 dark:text-zinc-300">
                          {loadingOrders ? (
                            <tr>
                              <td colSpan={13} className="p-12 text-center">
                                <Loader2 className="animate-spin text-[#7C3AED] mx-auto" size={24} />
                              </td>
                            </tr>
                          ) : filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={13} className="p-12 text-center text-gray-400 dark:text-zinc-500 italic bg-gray-50/10">
                                No matching orders found.
                              </td>
                            </tr>
                          ) : filteredOrders.map((o: any) => {
                            const totalQty = o.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
                            const productSummary = o.items?.map((item: any) => `${item.product?.name || 'Product'} (x${item.quantity})`).join(', ') || 'N/A';

                            return (
                              <tr key={o.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                                <td className="p-4 pl-6 font-semibold text-gray-900 dark:text-white">{o.orderNumber || o.id.substring(0, 8)}</td>
                                <td className="p-4 text-[12px]">{formatDateOnly(o.createdAt)}</td>
                                <td className="p-4 text-[12px]">{formatTimeOnly(o.createdAt)}</td>
                                <td className="p-4 font-semibold text-gray-900 dark:text-white">{o.customerName || `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.trim() || 'Guest'}</td>
                                <td className="p-4 text-[12px] text-gray-400 truncate max-w-[120px]">{o.customerEmail || o.user?.email || 'N/A'}</td>
                                <td className="p-4 text-[12px] text-gray-400">{o.customerPhone || 'N/A'}</td>
                                <td className="p-4 text-[12px] leading-tight truncate max-w-[160px] text-gray-400/90" title={productSummary}>
                                  {productSummary}
                                </td>
                                <td className="p-4 text-center font-semibold">{totalQty}</td>
                                <td className="p-4 text-right font-medium text-gray-900 dark:text-white">₹{Number(o.totalAmount).toLocaleString()}</td>
                                <td className="p-4 text-center">
                                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-semibold border ${
                                    (o.paymentStatus || 'PENDING') === 'SUCCESS' 
                                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30" 
                                      : (o.paymentStatus || 'PENDING') === 'PENDING' 
                                        ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30" 
                                        : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30"
                                  }`}>{o.paymentStatus || "PENDING"}</span>
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-semibold border uppercase ${
                                    (o.shippingStatus || 'PENDING') === 'DELIVERED' 
                                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30" 
                                      : (o.shippingStatus || 'PENDING') === 'CANCELLED' 
                                        ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30" 
                                        : (o.shippingStatus || 'PENDING') === 'SHIPPED' 
                                          ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30" 
                                          : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30"
                                  }`}>{o.shippingStatus || "PENDING"}</span>
                                </td>
                                <td className="p-4 font-mono text-[11px] text-gray-400 truncate max-w-[80px]">{o.trackingId || 'N/A'}</td>
                                <td className="p-4 pr-6 text-right">
                                  <button
                                    onClick={() => handleOpenOrderDetails(o)}
                                    className="text-[#7C3AED] hover:underline text-[12px] font-semibold cursor-pointer bg-transparent border-none outline-none"
                                  >
                                    Configure
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

              {/* === PANEL 4: CUSTOMERS DIRECTORY === */}
              {activePanel === "customers" && (
                <motion.div
                  key="customers"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="p-6 border-b border-[#E5E7EB] dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40">
                    <h3 className="font-display text-[18px] text-gray-900 dark:text-white font-semibold">Customers Directory</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px] border-collapse">
                      <thead>
                        <tr className="border-b border-[#E5E7EB] dark:border-zinc-800 font-label-caps text-[9px] tracking-widest uppercase text-gray-400">
                          <th className="p-4 pl-6">Client Name</th>
                          <th className="p-4">Email Address</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4" style={{ width: "25%" }}>Address</th>
                          <th className="p-4">Role Permission</th>
                          <th className="p-4 pr-6 text-right">Total Spent</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E7EB] dark:divide-zinc-800 font-body text-gray-700 dark:text-zinc-300">
                        {loadingCustomers ? (
                          <tr>
                            <td colSpan={6} className="p-12 text-center">
                              <Loader2 className="animate-spin text-[#7C3AED] mx-auto" size={24} />
                            </td>
                          </tr>
                        ) : adminCustomers.map((c: any) => (
                          <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                            <td className="p-4 pl-6 font-semibold text-gray-900 dark:text-white">{c.firstName} {c.lastName}</td>
                            <td className="p-4">{c.email}</td>
                            <td className="p-4 font-light text-[12px]">{c.phone}</td>
                            <td className="p-4 font-light text-[12px] leading-relaxed truncate max-w-[200px]">{c.address}</td>
                            <td className="p-4 font-semibold text-[#7C3AED]">
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
                                className="border border-[#E5E7EB] dark:border-zinc-800 rounded-lg px-2.5 py-1 text-[12px] font-body outline-none focus:border-[#7C3AED] bg-white dark:bg-[#18181B] text-gray-900 dark:text-white"
                              >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                              </select>
                            </td>
                            <td className="p-4 pr-6 text-right font-semibold text-gray-900 dark:text-white">
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
        </div>

        {/* === INVENTORY EDIT/CREATE MODAL === */}
        <AnimatePresence>
          {productModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 backdrop-blur-sm pointer-events-auto"
                onClick={() => setProductModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: "-45%", x: "-50%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, y: "-45%", x: "-50%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="fixed top-1/2 left-1/2 w-full max-w-[540px] bg-white dark:bg-[#18181B] z-50 shadow-2xl overflow-hidden border border-[#E5E7EB] dark:border-zinc-800 rounded-3xl"
              >
                <div className="p-6 border-b border-[#E5E7EB] dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/40">
                  <div>
                    <h3 className="font-display text-[22px] text-gray-900 dark:text-white font-semibold">
                      {editingProductId ? "Configure Jewelry Design" : "New Jewelry Entry"}
                    </h3>
                  </div>
                  <button onClick={() => setProductModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 border border-outline rounded-full cursor-pointer">
                    <X size={16} className="stroke-[1.5]" />
                  </button>
                </div>

                <form onSubmit={handleAddProductSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                  {/* Auto-save & Status indicator */}
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-zinc-900/60 p-3.5 border border-[#E5E7EB] dark:border-zinc-800 rounded-xl">
                    <span className="text-[11px] text-gray-500 dark:text-zinc-400">Design State</span>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-500">
                      <CheckCircle size={12} /> Auto-save active
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Design Name</label>
                    <input
                      type="text"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="h-11 border border-[#E5E7EB] dark:border-zinc-800 bg-transparent rounded-xl px-4 text-[13px] font-body focus:border-[#7C3AED] outline-none text-gray-900 dark:text-white"
                      placeholder="e.g. Lumina Stacking Ring"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">SKU</label>
                      <input
                        type="text"
                        value={newProdSku}
                        onChange={(e) => setNewProdSku(e.target.value)}
                        className="h-11 border border-[#E5E7EB] dark:border-zinc-800 bg-transparent rounded-xl px-4 text-[13px] font-body focus:border-[#7C3AED] outline-none text-gray-900 dark:text-white"
                        placeholder="LUMINA_RING_01"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Category</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="h-11 border border-[#E5E7EB] dark:border-zinc-800 rounded-xl px-4 text-[13px] font-body outline-none focus:border-[#7C3AED] bg-white dark:bg-[#18181B] text-gray-900 dark:text-white"
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
                      <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Price (₹)</label>
                      <input
                        type="number"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="h-11 border border-[#E5E7EB] dark:border-zinc-800 bg-transparent rounded-xl px-4 text-[13px] font-body focus:border-[#7C3AED] outline-none text-gray-900 dark:text-white"
                        placeholder="1250"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Orig Price (₹)</label>
                      <input
                        type="number"
                        value={newProdOriginalPrice}
                        onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                        className="h-11 border border-[#E5E7EB] dark:border-zinc-800 bg-transparent rounded-xl px-4 text-[13px] font-body focus:border-[#7C3AED] outline-none text-gray-900 dark:text-white"
                        placeholder="1450"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Stock Qty</label>
                      <input
                        type="number"
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        className="h-11 border border-[#E5E7EB] dark:border-zinc-800 bg-transparent rounded-xl px-4 text-[13px] font-body focus:border-[#7C3AED] outline-none text-gray-900 dark:text-white"
                        placeholder="50"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Description</label>
                    <textarea
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      className="h-24 border border-[#E5E7EB] dark:border-zinc-800 bg-transparent rounded-xl p-4 text-[13px] font-body focus:border-[#7C3AED] outline-none resize-none text-gray-900 dark:text-white"
                      placeholder="Write description..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Base Metals</label>
                      {["18k Solid Gold", "14k Solid Gold", "925 Sterling Silver", "Platinum"].map(m => (
                        <label key={m} className="flex items-center gap-2.5 text-[12.5px] font-body text-gray-700 dark:text-zinc-300">
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
                      <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Color Finishes</label>
                      {["Champagne Gold", "Rose Gold", "White Gold", "Silver"].map(f => (
                        <label key={f} className="flex items-center gap-2.5 text-[12.5px] font-body text-gray-700 dark:text-zinc-300">
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

                  <div className="grid grid-cols-2 gap-4 border-t border-[#E5E7EB] dark:border-zinc-800 pt-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Rating (0-5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={newProdRating}
                        onChange={(e) => setNewProdRating(e.target.value)}
                        className="h-11 border border-[#E5E7EB] dark:border-zinc-800 bg-transparent rounded-xl px-4 text-[13px] font-body focus:border-[#7C3AED] outline-none text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Review Count</label>
                      <input
                        type="number"
                        value={newProdReviewsCount}
                        onChange={(e) => setNewProdReviewsCount(e.target.value)}
                        className="h-11 border border-[#E5E7EB] dark:border-zinc-800 bg-transparent rounded-xl px-4 text-[13px] font-body focus:border-[#7C3AED] outline-none text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-6 border-b border-[#E5E7EB] dark:border-zinc-800 pb-4">
                    <label className="flex items-center gap-2 text-[12px] font-body font-semibold">
                      <input type="checkbox" checked={newProdIsBestSeller} onChange={(e) => setNewProdIsBestSeller(e.target.checked)} />
                      Best Seller Badge
                    </label>
                    <label className="flex items-center gap-2 text-[12px] font-body font-semibold">
                      <input type="checkbox" checked={newProdIsNewArrival} onChange={(e) => setNewProdIsNewArrival(e.target.checked)} />
                      New Arrival Badge
                    </label>
                  </div>

                  {/* Image upload area */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Primary Image</label>
                    {existingImages.length > 0 && !newProdMainImage && (
                      <div className="relative w-14 h-14 border border-[#E5E7EB] bg-gray-50 rounded-lg overflow-hidden mb-2">
                        <Image src={existingImages[0]} alt="Main" fill className="object-cover" />
                      </div>
                    )}
                    {newProdMainImage && (
                      <div className="relative w-14 h-14 border border-[#E5E7EB] rounded-lg overflow-hidden mb-2 group">
                        <Image src={URL.createObjectURL(newProdMainImage)} alt="New Main" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewProdMainImage(null)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}
                    {!newProdMainImage && (
                      <div className="border border-dashed border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-6 text-center hover:bg-gray-50/50 transition-colors relative cursor-pointer">
                        <Upload size={20} className="text-gray-400 mx-auto mb-2" />
                        <span className="text-[12px] text-gray-500 font-body block">Drag & drop primary image</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setNewProdMainImage(e.target.files[0]);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={isUploading} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 h-12 rounded-xl font-label-caps text-[11px] tracking-widest uppercase hover:bg-[#7C3AED] hover:text-white transition-all flex items-center justify-center font-bold mt-4 cursor-pointer disabled:opacity-50 shadow-sm">
                    {isUploading ? <Loader2 className="animate-spin text-primary" size={16} /> : (editingProductId ? "Update Product" : "Save Product")}
                  </button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* === ORDER DETAIL & CONFIGURE MODAL === */}
        <AnimatePresence>
          {orderModalOpen && selectedOrder && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 backdrop-blur-sm pointer-events-auto"
                onClick={() => { setOrderModalOpen(false); setSelectedOrder(null); }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: "-45%", x: "-50%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, y: "-45%", x: "-50%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="fixed top-1/2 left-1/2 w-full max-w-[660px] bg-white dark:bg-[#18181B] z-50 shadow-2xl overflow-hidden border border-[#E5E7EB] dark:border-zinc-800 rounded-3xl flex flex-col max-h-[85vh]"
              >
                <div className="p-6 border-b border-[#E5E7EB] dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/40 shrink-0">
                  <div>
                    <span className="font-label-caps text-[9px] tracking-widest text-[#7C3AED] font-bold uppercase block">Logistics Portal</span>
                    <h3 className="font-display text-[22px] text-gray-900 dark:text-white font-semibold mt-1">Configure Order</h3>
                  </div>
                  <button
                    onClick={() => { setOrderModalOpen(false); setSelectedOrder(null); }}
                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 border border-outline rounded-full cursor-pointer"
                  >
                    <X size={16} className="stroke-[1.5]" />
                  </button>
                </div>

                <div className="flex-grow p-6 space-y-6 overflow-y-auto font-body text-[13px] text-gray-800 dark:text-zinc-300">
                  {/* Meta details */}
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-zinc-900/40 p-4 border border-[#E5E7EB] dark:border-zinc-800 rounded-2xl">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Order Reference ID</div>
                      <div className="font-semibold text-[14px] mt-1 text-gray-900 dark:text-white">{selectedOrder.orderNumber || selectedOrder.id}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Order Date & Time</div>
                      <div className="font-semibold text-[14px] mt-1 text-gray-900 dark:text-white">{formatDateTime(selectedOrder.createdAt)}</div>
                    </div>
                  </div>

                  {/* Grid info customer and address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50/30 dark:bg-zinc-900/20 border border-[#E5E7EB] dark:border-zinc-800 rounded-2xl p-4 space-y-3">
                      <h4 className="font-display font-bold text-[14px] text-[#7C3AED] border-b border-[#E5E7EB] dark:border-zinc-800 pb-2">Customer Profile</h4>
                      <div className="space-y-1.5 text-[12px] leading-relaxed">
                        <div><strong className="text-gray-400 dark:text-zinc-500 font-normal">Name:</strong> {selectedOrder.customerName || `${selectedOrder.user?.firstName || ''} ${selectedOrder.user?.lastName || ''}`.trim() || 'N/A'}</div>
                        <div><strong className="text-gray-400 dark:text-zinc-500 font-normal">Email:</strong> {selectedOrder.customerEmail || selectedOrder.user?.email || 'N/A'}</div>
                        <div><strong className="text-gray-400 dark:text-zinc-500 font-normal">Phone:</strong> {selectedOrder.customerPhone || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="bg-gray-50/30 dark:bg-zinc-900/20 border border-[#E5E7EB] dark:border-zinc-800 rounded-2xl p-4 space-y-3">
                      <h4 className="font-display font-bold text-[14px] text-[#7C3AED] border-b border-[#E5E7EB] dark:border-zinc-800 pb-2">Shipping Destination</h4>
                      <div className="space-y-1.5 text-[12px] leading-relaxed">
                        {selectedOrder.shippingAddress && typeof selectedOrder.shippingAddress === 'object' ? (
                          <>
                            <div><strong>Street:</strong> {selectedOrder.shippingAddress.street || selectedOrder.shippingAddress.address || 'N/A'}</div>
                            <div><strong>City:</strong> {selectedOrder.shippingAddress.city || 'N/A'}</div>
                            <div><strong>State:</strong> {selectedOrder.shippingAddress.state || 'N/A'}</div>
                            <div><strong>Country/Pin:</strong> {selectedOrder.shippingAddress.country || 'India'} - {selectedOrder.shippingAddress.pincode || 'N/A'}</div>
                          </>
                        ) : (
                          <div className="italic text-gray-400 dark:text-zinc-500">Address information not stored in structured format.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Products list summary */}
                  <div className="space-y-3">
                    <h4 className="font-display font-bold text-[14px] text-[#7C3AED] border-b border-[#E5E7EB] dark:border-zinc-800 pb-2">Items Included</h4>
                    <div className="divide-y divide-[#E5E7EB] dark:divide-zinc-800 border border-[#E5E7EB] dark:border-zinc-800 bg-white dark:bg-[#18181B] rounded-2xl overflow-hidden">
                      {selectedOrder.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-gray-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                          <div className="relative w-10 h-10 overflow-hidden bg-gray-50 rounded-lg border border-[#E5E7EB] dark:border-zinc-700 shrink-0">
                            <Image src={item.product?.images?.[0]?.url || item.product?.imageUrl || '/hero_model.png'} alt={item.product?.name} fill className="object-cover" />
                          </div>
                          <div className="flex-grow">
                            <div className="font-semibold text-[13px] text-gray-900 dark:text-white">{item.product?.name || "Jewelry Item"}</div>
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">SKU: {item.product?.sku || "N/A"}</div>
                          </div>
                          <div className="text-[12px] text-gray-400 shrink-0">Qty: <span className="font-bold text-gray-900 dark:text-white">{item.quantity}</span></div>
                          <div className="text-right text-[13px] font-semibold shrink-0 min-w-[70px] text-gray-900 dark:text-white">₹{Number(item.price).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subtotals & Payment Mode */}
                  <div className="bg-gray-50 dark:bg-zinc-900/40 p-4 border border-[#E5E7EB] dark:border-zinc-800 rounded-2xl grid grid-cols-2 gap-4 items-center">
                    <div className="text-[12px] leading-relaxed">
                      <div><strong className="text-gray-400 dark:text-zinc-500 font-normal">Method:</strong> {selectedOrder.payment?.method || 'Cash on Delivery'}</div>
                      <div><strong className="text-gray-400 dark:text-zinc-500 font-normal">Payment ID:</strong> {selectedOrder.payment?.transactionId || 'N/A'}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-label-caps text-[9px] uppercase tracking-wider text-gray-400">Billing Amount</span>
                      <div className="text-[20px] font-bold text-[#7C3AED] mt-1">₹{Number(selectedOrder.totalAmount).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Admin update details form */}
                  <form onSubmit={handleUpdateOrderDetails} className="space-y-4 pt-4 border-t border-[#E5E7EB] dark:border-zinc-800">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Shipping Status</label>
                        <select
                          value={modalShippingStatus}
                          onChange={(e) => setModalShippingStatus(e.target.value)}
                          className="h-11 border border-[#E5E7EB] dark:border-zinc-800 rounded-xl px-4 text-[13px] font-body outline-none focus:border-[#7C3AED] bg-white dark:bg-[#18181B] text-gray-900 dark:text-white"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Payment Status</label>
                        <select
                          value={modalPaymentStatus}
                          onChange={(e) => setModalPaymentStatus(e.target.value)}
                          className="h-11 border border-[#E5E7EB] dark:border-zinc-800 rounded-xl px-4 text-[13px] font-body outline-none focus:border-[#7C3AED] bg-white dark:bg-[#18181B] text-gray-900 dark:text-white"
                        >
                          <option value="PENDING">Pending (Unpaid)</option>
                          <option value="SUCCESS">Success (Paid)</option>
                          <option value="FAILED">Failed</option>
                          <option value="REFUNDED">Refunded</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Tracking ID (AWB)</label>
                      <input
                        type="text"
                        value={modalTrackingId}
                        onChange={(e) => setModalTrackingId(e.target.value)}
                        className="h-11 border border-[#E5E7EB] dark:border-zinc-800 bg-transparent rounded-xl px-4 text-[13px] font-body focus:border-[#7C3AED] outline-none text-gray-900 dark:text-white"
                        placeholder="e.g. AWB198273928"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[9px] tracking-widest uppercase text-gray-500 font-semibold">Internal Admin Notes</label>
                      <textarea
                        value={modalAdminNotes}
                        onChange={(e) => setModalAdminNotes(e.target.value)}
                        className="h-20 border border-[#E5E7EB] dark:border-zinc-800 bg-transparent rounded-xl p-4 text-[13px] font-body focus:border-[#7C3AED] outline-none resize-none text-gray-900 dark:text-white"
                        placeholder="Add notes..."
                      />
                    </div>

                    <button type="submit" disabled={modalUpdating} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 h-12 rounded-xl font-label-caps text-[11px] tracking-widest uppercase hover:bg-[#7C3AED] hover:text-white transition-all flex items-center justify-center font-bold mt-2 cursor-pointer disabled:opacity-50 shadow-sm">
                      {modalUpdating ? <Loader2 className="animate-spin text-primary" size={16} /> : "Update Order Logs"}
                    </button>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* === GLOBAL COMMAND PALETTE MODAL === */}
        <AnimatePresence>
          {commandPaletteOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 dark:bg-black/80 z-[100] backdrop-blur-md pointer-events-auto"
                onClick={() => setCommandPaletteOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
                transition={{ type: "spring", damping: 25, stiffness: 240 }}
                className="fixed top-1/3 left-1/2 w-full max-w-[560px] bg-white dark:bg-[#18181B] z-[100] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 overflow-hidden"
              >
                {/* Search Input */}
                <div className="relative flex items-center border-b border-[#E5E7EB] dark:border-zinc-800 px-6 py-4">
                  <Command size={18} className="text-gray-400 mr-3 shrink-0" />
                  <input
                    type="text"
                    placeholder="Type a command or search action..."
                    value={commandQuery}
                    onChange={(e) => setCommandQuery(e.target.value)}
                    className="w-full bg-transparent text-[15px] font-body text-gray-900 dark:text-white focus:outline-none placeholder-gray-400 tracking-wide"
                    autoFocus
                  />
                  <button 
                    onClick={() => setCommandPaletteOpen(false)}
                    className="text-[10px] bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-2 py-1 rounded text-gray-400"
                  >
                    ESC
                  </button>
                </div>

                {/* Match Lists */}
                <div className="max-h-[300px] overflow-y-auto p-3.5 space-y-1 bg-[#FAFAFA] dark:bg-[#111111]">
                  <p className="font-label-caps text-[8px] tracking-widest text-gray-400 font-bold uppercase mb-2 px-2.5">Available Commands</p>
                  
                  {commandResults.length === 0 ? (
                    <p className="text-[12px] text-gray-400 py-6 text-center italic">No matching commands found.</p>
                  ) : (
                    commandResults.map((cmd, idx) => (
                      <div
                        key={idx}
                        onClick={cmd.action}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-[#E5E7EB] dark:hover:border-zinc-700 group text-left"
                      >
                        <div>
                          <span className="block text-[13px] text-gray-800 dark:text-zinc-200 group-hover:text-gray-900 dark:group-hover:text-white font-medium">{cmd.name}</span>
                          <span className="block text-[9px] font-label-caps uppercase tracking-widest text-gray-400 mt-0.5">{cmd.type}</span>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 group-hover:text-[#7C3AED] transition-colors" />
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Hint */}
                <div className="bg-white dark:bg-[#18181B] px-6 py-3 border-t border-[#E5E7EB] dark:border-zinc-800 text-[10px] text-gray-400 flex justify-between items-center">
                  <span>Use ↑↓ arrows to navigate, Enter to select</span>
                  <span className="italic">Aurora SaaS Console v1.0</span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* === CONFIRM DELETE DIALOG === */}
        <AnimatePresence>
          {deleteConfirmId && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 backdrop-blur-sm pointer-events-auto"
                onClick={() => setDeleteConfirmId(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
                className="fixed top-1/2 left-1/2 w-full max-w-[400px] bg-white dark:bg-[#18181B] z-50 shadow-2xl p-6 border border-[#E5E7EB] dark:border-zinc-800 rounded-3xl"
              >
                <h4 className="font-display font-semibold text-[20px] text-gray-900 dark:text-white">Delete Product Design?</h4>
                <p className="font-body text-[13px] text-gray-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Are you absolutely sure you want to delete this jewelry design? This action is permanent and cannot be undone.
                </p>
                <div className="flex gap-3 justify-end mt-6">
                  <button 
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-4 py-2 border border-[#E5E7EB] dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 rounded-xl text-[12px] font-semibold text-gray-700 dark:text-zinc-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(deleteConfirmId)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[12px] font-semibold transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={12} /> Confirm Delete
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
