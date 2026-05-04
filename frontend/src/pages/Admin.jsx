// frontend/src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Package, ShoppingBag, DollarSign, Download, Pencil, Trash2, Eye, EyeOff, Star, Loader2, LogOut, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { productsApi, ordersApi } from '@/api/basecolorimag';

const THEMES = ['animals', 'space', 'dinosaurs', 'princesses', 'nature', 'vehicles', 'fantasy', 'ocean'];
const AGE_GROUPS = ['3-5', '6-8', '9-10'];
const BADGES = ['', 'new', 'popular', 'bestseller', 'promo'];

function StatCard({ title, value, icon: Icon, gradient }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 transform translate-x-6 -translate-y-6 bg-gradient-to-br ${gradient} rounded-full opacity-10`} />
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">{title}</p>
        <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient}`}><Icon className="w-4 h-4 text-white" /></div>
      </div>
      <p className="text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function LoginForm({ onLogin }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">{t('admin.login')}</h1>
          <p className="text-gray-500 text-sm mt-1">ColoriMagiques</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('admin.login')}
          </button>
        </form>
      </div>
    </div>
  );
}

function ProductForm({ product, onSave, onCancel }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    title: product?.title || '', title_en: product?.title_en || '', title_es: product?.title_es || '', title_de: product?.title_de || '',
    description: product?.description || '', description_en: product?.description_en || '',
    short_description: product?.short_description || '',
    price_eur: product?.price_eur || '', price_usd: product?.price_usd || '',
    compare_price_eur: product?.compare_price_eur || '', compare_price_usd: product?.compare_price_usd || '',
    page_count: product?.page_count || '', dpi: product?.dpi || 300,
    age_group: product?.age_group || '3-5', theme: product?.theme || 'animals',
    badge: product?.badge || '', is_featured: product?.is_featured ?? false, is_published: product?.is_published ?? true,
  });
  const [files, setFiles] = useState({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (files.pdf_file) formData.append('pdf_file', files.pdf_file);
      if (files.bonus_file) formData.append('bonus_file', files.bonus_file);
      if (files.cover_image) formData.append('cover_image', files.cover_image);
      if (files.preview_images) {
        Array.from(files.preview_images).forEach((f) => formData.append('preview_images', f));
      }

      if (product?.id) {
        await productsApi.update(product.id, formData);
      } else {
        await productsApi.create(formData);
      }
      onSave();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 mb-6 space-y-4">
      <h3 className="text-lg font-bold">{product ? t('admin.editProduct') : t('admin.addProduct')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre (FR) *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title (EN)</label>
          <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description (FR)</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" rows={3} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix EUR *</label>
          <input type="number" step="0.01" value={form.price_eur} onChange={(e) => setForm({ ...form, price_eur: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix USD *</label>
          <input type="number" step="0.01" value={form.price_usd} onChange={(e) => setForm({ ...form, price_usd: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nb pages</label>
          <input type="number" value={form.page_count} onChange={(e) => setForm({ ...form, page_count: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">DPI</label>
          <input type="number" value={form.dpi} onChange={(e) => setForm({ ...form, dpi: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Âge *</label>
          <select value={form.age_group} onChange={(e) => setForm({ ...form, age_group: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm">
            {AGE_GROUPS.map((a) => <option key={a} value={a}>{a} ans</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thème *</label>
          <select value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm">
            {THEMES.map((th) => <option key={th} value={th}>{th}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
          <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm">
            {BADGES.map((b) => <option key={b} value={b}>{b || '— Aucun —'}</option>)}
          </select>
        </div>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded" />
            Vedette
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded" />
            Publié
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fichier PDF</label>
          <input type="file" accept=".pdf" onChange={(e) => setFiles({ ...files, pdf_file: e.target.files[0] })} className="w-full text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image couverture</label>
          <input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, cover_image: e.target.files[0] })} className="w-full text-sm" />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-6 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} {t('admin.save')}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">{t('admin.cancel')}</button>
      </div>
    </form>
  );
}

export default function Admin() {
  const { t } = useLanguage();
  const { isAuthenticated, login, logout, isLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadData = () => {
    productsApi.listAll().then(setProducts).catch(console.error);
    ordersApi.listAll().then(setOrders).catch(console.error);
    ordersApi.stats().then(setStats).catch(console.error);
  };

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>;
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await productsApi.delete(id);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">{t('admin.dashboard')} 🎨</h1>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" /> {t('admin.logout')}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title={t('admin.totalRevenue')} value={`€${(stats.totalRevenue || 0).toFixed(2)}`} icon={DollarSign} gradient="from-emerald-500 to-teal-500" />
          <StatCard title={t('admin.totalOrders')} value={stats.totalOrders || 0} icon={ShoppingBag} gradient="from-purple-500 to-pink-500" />
          <StatCard title={t('admin.totalProducts')} value={stats.totalProducts || 0} icon={Package} gradient="from-blue-500 to-cyan-500" />
          <StatCard title={t('admin.totalDownloads')} value={stats.totalDownloads || 0} icon={Download} gradient="from-amber-500 to-orange-500" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border p-1 mb-6 w-fit">
          <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{t('admin.products')}</button>
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{t('admin.orders')}</button>
        </div>

        {activeTab === 'products' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('admin.products')}</h2>
              <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 flex items-center gap-2">
                <Plus className="w-4 h-4" /> {t('admin.addProduct')}
              </button>
            </div>

            {showForm && (
              <ProductForm
                product={editing}
                onSave={() => { setShowForm(false); setEditing(null); loadData(); }}
                onCancel={() => { setShowForm(false); setEditing(null); }}
              />
            )}

            <div className="bg-white rounded-2xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-3">Produit</th>
                      <th className="px-4 py-3">Prix</th>
                      <th className="px-4 py-3">Thème</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 rounded-lg bg-purple-50 overflow-hidden flex-shrink-0">
                              {p.cover_image ? <img src={p.cover_image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm">🎨</div>}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-900 truncate max-w-[200px]">{p.title}</p>
                              <p className="text-xs text-gray-400">{p.page_count} pages • {p.age_group} ans</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{parseFloat(p.price_eur).toFixed(2)}€</td>
                        <td className="px-4 py-3"><span className="text-xs bg-gray-100 px-2 py-1 rounded-lg">{p.theme}</span></td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-lg font-medium ${p.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {p.is_published ? 'Publié' : 'Brouillon'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-2 hover:bg-purple-50 rounded-lg text-gray-400 hover:text-purple-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <h2 className="text-xl font-bold mb-4">{t('admin.orders')}</h2>
            <div className="bg-white rounded-2xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-3">N° Commande</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((o) => {
                      const statusColors = { pending: 'bg-amber-100 text-amber-700', paid: 'bg-blue-100 text-blue-700', delivered: 'bg-emerald-100 text-emerald-700', refunded: 'bg-red-100 text-red-700' };
                      return (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">{o.order_number}</td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-900">{o.customer_name}</p>
                            <p className="text-xs text-gray-400">{o.customer_email}</p>
                          </td>
                          <td className="px-4 py-3 text-sm font-bold">{parseFloat(o.total_amount).toFixed(2)}{o.currency === 'EUR' ? '€' : '$'}</td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-lg font-medium ${statusColors[o.status] || 'bg-gray-100'}`}>{o.status}</span></td>
                          <td className="px-4 py-3 text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                        </tr>
                      );
                    })}
                    {orders.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-400">Aucune commande</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
