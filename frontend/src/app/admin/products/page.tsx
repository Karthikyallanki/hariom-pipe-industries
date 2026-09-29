'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Search,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Star,
  Layers,
  Save,
  Loader2,
  Package,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { IProduct, ICategory } from '@/types';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: 'Hariom Pipes',
    shortDescription: '',
    description: '',
    applications: '',
    standards: '',
    finishes: '',
    availableSizes: '',
    gradeSpec: '',
    thicknessSpec: '',
    lengthSpec: '',
    featured: false,
    isPublished: true,
  });

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('hpil_admin_token');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const [prodRes, catRes] = await Promise.all([
        apiClient.get<IProduct[]>('/products/admin/all', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        apiClient.get<ICategory[]>('/products/categories'),
      ]);

      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data);
      } else {
        setError(prodRes.error?.message || 'Failed to fetch product catalog.');
      }

      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
      }
    } catch (err) {
      setError('Connection error loading product management system.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories[0]?._id || '',
      brand: 'Hariom Pipes',
      shortDescription: '',
      description: '',
      applications: 'Structural Infrastructure, Industrial Frameworks, Solar Racking',
      standards: 'IS 1161, IS 4923, IS 1239',
      finishes: 'Black Oiled, Hot-Dip Galvanized',
      availableSizes: '15 NB, 20 NB, 25 NB, 50 NB, 100 NB',
      gradeSpec: 'IS 1161 / IS 4923 / YST 240',
      thicknessSpec: '1.20mm to 6.00mm',
      lengthSpec: '6.0 meters / 12.0 meters',
      featured: false,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: IProduct) => {
    setEditingProduct(product);
    const categoryId = typeof product.category === 'object' ? product.category._id : product.category;

    const grade = product.specifications?.find((s) => s.name === 'Grade')?.value || '';
    const thickness = product.specifications?.find((s) => s.name === 'Thickness Range')?.value || '';
    const length = product.specifications?.find((s) => s.name === 'Standard Length')?.value || '';

    setFormData({
      name: product.name,
      category: categoryId,
      brand: product.brand || 'Hariom Pipes',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      applications: product.applications?.join(', ') || '',
      standards: product.standards?.join(', ') || '',
      finishes: product.finishes?.join(', ') || '',
      availableSizes: product.availableSizes?.join(', ') || '',
      gradeSpec: grade,
      thicknessSpec: thickness,
      lengthSpec: length,
      featured: product.featured || false,
      isPublished: product.isPublished !== false,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const token = localStorage.getItem('hpil_admin_token');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    const payload = {
      name: formData.name,
      category: formData.category,
      brand: formData.brand,
      shortDescription: formData.shortDescription,
      description: formData.description,
      applications: formData.applications.split(',').map((s) => s.trim()).filter(Boolean),
      standards: formData.standards.split(',').map((s) => s.trim()).filter(Boolean),
      finishes: formData.finishes.split(',').map((s) => s.trim()).filter(Boolean),
      availableSizes: formData.availableSizes.split(',').map((s) => s.trim()).filter(Boolean),
      specifications: [
        { name: 'Grade', value: formData.gradeSpec },
        { name: 'Thickness Range', value: formData.thicknessSpec },
        { name: 'Standard Length', value: formData.lengthSpec },
      ],
      featured: formData.featured,
      isPublished: formData.isPublished,
    };

    try {
      if (editingProduct) {
        // UPDATE Product
        const res = await apiClient.patch<IProduct>(`/products/admin/${editingProduct._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.success) {
          setSuccessMessage(`Product "${formData.name}" updated successfully.`);
          setIsModalOpen(false);
          fetchAdminData();
        } else {
          setError(res.error?.message || 'Failed to update product.');
        }
      } else {
        // CREATE Product
        const res = await apiClient.post<IProduct>('/products/admin', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.success) {
          setSuccessMessage(`Product "${formData.name}" created successfully.`);
          setIsModalOpen(false);
          fetchAdminData();
        } else {
          setError(res.error?.message || 'Failed to create product specification.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred while saving product data.');
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublishStatus = async (product: IProduct) => {
    const token = localStorage.getItem('hpil_admin_token');
    if (!token) return;

    try {
      const res = await apiClient.patch<IProduct>(
        `/products/admin/${product._id}`,
        { isPublished: !product.isPublished },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, isPublished: !p.isPublished } : p))
        );
        setSuccessMessage(`Product status updated.`);
      }
    } catch (e) {
      setError('Failed to update publication status.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const token = localStorage.getItem('hpil_admin_token');
    if (!token) return;

    try {
      const res = await apiClient.delete(`/products/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setSuccessMessage('Product specification deleted successfully.');
        setDeleteConfirmId(null);
      } else {
        setError(res.error?.message || 'Failed to delete product.');
      }
    } catch (err) {
      setError('Connection error while deleting product.');
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.standards?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const categoryId = typeof p.category === 'object' ? p.category._id : p.category;
    const matchesCategory = selectedCategory === 'ALL' || categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-steel-dark text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-steel-navy/95 border-b border-steel-border backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="p-2 bg-steel-dark border border-steel-border rounded-xl text-steel-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-primary/10 border border-amber-primary/30 rounded-xl text-amber-primary">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold font-heading text-white tracking-wider text-base uppercase">
                Catalog & SKUs Manager
              </h1>
              <p className="text-xs text-amber-primary font-mono font-semibold">
                Hariom Pipe Industries Ltd &bull; Products Engine
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="p-2.5 text-steel-muted hover:text-white bg-steel-dark border border-steel-border rounded-xl transition-colors flex items-center gap-1.5 text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-amber-primary hover:bg-amber-hover text-steel-dark font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-primary/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Success / Error Banners */}
        {successMessage && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-2xl text-red-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="bg-steel-navy border border-steel-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name, standard..."
              className="w-full pl-10 pr-4 py-2.5 bg-steel-dark border border-steel-border/80 rounded-xl text-white placeholder-steel-muted text-xs focus:outline-none focus:border-amber-primary"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Layers className="w-4 h-4 text-steel-muted shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-64 py-2.5 px-3 bg-steel-dark border border-steel-border/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-primary"
            >
              <option value="ALL">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-steel-navy border border-steel-border rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-steel-border/50">
            <h2 className="text-base font-bold font-heading text-white">
              Registered Products ({filteredProducts.length})
            </h2>
            <span className="text-xs text-steel-muted font-mono">Real-time Catalog Control</span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-steel-muted text-xs">
              Fetching products catalog from Hariom Pipes database...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-steel-muted text-xs">
              No product specifications found matching criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-steel-border/40 text-steel-muted uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Product Name & Grade</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Standards & Finishes</th>
                    <th className="py-3 px-3">Featured</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-steel-border/30">
                  {filteredProducts.map((p) => {
                    const categoryName = typeof p.category === 'object' ? p.category.name : 'Category';
                    return (
                      <tr key={p._id} className="hover:bg-steel-dark/50 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-white text-sm">{p.name}</div>
                          <div className="text-[10px] text-steel-muted font-mono mt-0.5">
                            slug: /{p.slug} &bull; {p.brand}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-1 bg-steel-dark border border-steel-border text-slate-300 rounded-lg text-[10px] font-medium">
                            {categoryName}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1">
                            {p.standards?.map((std) => (
                              <span
                                key={std}
                                className="px-2 py-0.5 bg-amber-primary/10 border border-amber-primary/20 text-amber-primary rounded text-[9px] font-mono"
                              >
                                {std}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          {p.featured ? (
                            <span className="inline-flex items-center gap-1 text-amber-primary text-[10px] font-semibold">
                              <Star className="w-3.5 h-3.5 fill-amber-primary" />
                              <span>Featured</span>
                            </span>
                          ) : (
                            <span className="text-steel-muted text-[10px]">Standard</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <button
                            onClick={() => togglePublishStatus(p)}
                            className={`px-2.5 py-1 border rounded-full text-[10px] font-semibold uppercase flex items-center gap-1.5 transition-colors ${
                              p.isPublished
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-steel-border/40 text-steel-muted border-steel-border hover:bg-steel-border/60'
                            }`}
                          >
                            {p.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{p.isPublished ? 'Published' : 'Draft'}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 bg-steel-dark border border-steel-border hover:border-amber-primary text-slate-300 hover:text-amber-primary rounded-lg transition-colors"
                              title="Edit Specification"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(p._id)}
                              className="p-1.5 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-steel-navy border border-steel-border rounded-2xl w-full max-w-2xl my-8 p-6 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-steel-border/60">
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-primary" />
                <span>{editingProduct ? 'Edit Product Specification' : 'Register New Product'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-steel-muted hover:text-white p-1 rounded-lg hover:bg-steel-border/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-steel-muted uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Hot Rolled (HR) Pipes & Tubes"
                    className="w-full p-2.5 bg-steel-dark border border-steel-border/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-steel-muted uppercase tracking-wider mb-1">
                    Product Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-steel-dark border border-steel-border/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-primary"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-steel-muted uppercase tracking-wider mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Hariom Pipes"
                    className="w-full p-2.5 bg-steel-dark border border-steel-border/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-steel-muted uppercase tracking-wider mb-1">
                    Grade Specification
                  </label>
                  <input
                    type="text"
                    value={formData.gradeSpec}
                    onChange={(e) => setFormData({ ...formData, gradeSpec: e.target.value })}
                    placeholder="e.g. IS 1161 / IS 4923 YST 240"
                    className="w-full p-2.5 bg-steel-dark border border-steel-border/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-steel-muted uppercase tracking-wider mb-1">
                  Short Description *
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Summary for product catalog cards..."
                  className="w-full p-2.5 bg-steel-dark border border-steel-border/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-steel-muted uppercase tracking-wider mb-1">
                  Full Technical Overview *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed engineering background and manufacturing details..."
                  className="w-full p-2.5 bg-steel-dark border border-steel-border/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-steel-muted uppercase tracking-wider mb-1">
                    BIS & ASTM Standards (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.standards}
                    onChange={(e) => setFormData({ ...formData, standards: e.target.value })}
                    placeholder="IS 1161, IS 4923, IS 1239"
                    className="w-full p-2.5 bg-steel-dark border border-steel-border/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-steel-muted uppercase tracking-wider mb-1">
                    Finishes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.finishes}
                    onChange={(e) => setFormData({ ...formData, finishes: e.target.value })}
                    placeholder="Black Oiled, Hot-Dip Galvanized"
                    className="w-full p-2.5 bg-steel-dark border border-steel-border/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-steel-muted uppercase tracking-wider mb-1">
                  Applications (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.applications}
                  onChange={(e) => setFormData({ ...formData, applications: e.target.value })}
                  placeholder="Structural Infrastructure, Solar Module Racking, Construction"
                  className="w-full p-2.5 bg-steel-dark border border-steel-border/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-primary"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded bg-steel-dark border-steel-border text-amber-primary focus:ring-amber-primary"
                  />
                  <span>Mark as Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded bg-steel-dark border-steel-border text-emerald-400 focus:ring-emerald-400"
                  />
                  <span>Published & Publicly Visible</span>
                </label>
              </div>

              <div className="pt-4 border-t border-steel-border/60 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-steel-dark border border-steel-border text-steel-muted hover:text-white rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-amber-primary hover:bg-amber-hover disabled:opacity-50 text-steel-dark font-bold rounded-xl text-xs flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingProduct ? 'Update Specification' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-steel-navy border border-steel-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold font-heading text-white">Confirm Product Deletion</h3>
            </div>
            <p className="text-xs text-steel-muted leading-relaxed">
              Are you sure you want to permanently delete this product specification from the Hariom Pipes catalog? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-steel-dark border border-steel-border text-steel-muted hover:text-white rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
