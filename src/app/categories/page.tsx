'use client';

import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAppSelector } from '@/store/hooks';
import {
  MdBrush,
  MdBuild,
  MdDelete,
  MdFavoriteBorder,
  MdMemory,
  MdHandyman,
  MdLocalShipping,
  MdOpacity,
  MdContentCut,
  MdVerified,
  MdRefresh,
  MdBolt,
} from 'react-icons/md';

type CategoryItem = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  color?: string;
  bgGradient?: string;
  count?: number;
};

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  iconName: string;
};

const ICONS: Record<string, React.ReactNode> = {
  ShieldCheck: <MdVerified className="h-5 w-5" />,
  Paintbrush: <MdBrush className="h-5 w-5" />,
  Wrench: <MdBuild className="h-5 w-5" />,
  Zap: <MdBolt className="h-5 w-5" />,
  Heart: <MdFavoriteBorder className="h-5 w-5" />,
  Cpu: <MdMemory className="h-5 w-5" />,
  Hammer: <MdHandyman className="h-5 w-5" />,
  Truck: <MdLocalShipping className="h-5 w-5" />,
  Droplets: <MdOpacity className="h-5 w-5" />,
  Scissors: <MdContentCut className="h-5 w-5" />,
  Trash2: <MdDelete className="h-5 w-5" />,
};

const ICON_OPTIONS = Object.keys(ICONS);

const INITIAL_FORM: CategoryForm = {
  name: '',
  slug: '',
  description: '',
  iconName: 'ShieldCheck',
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function CategoriesAdminPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const adminToken = useAppSelector((state) => state.auth.session?.accessToken || '');
  const [items, setItems] = React.useState<CategoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState('');
  const [editingId, setEditingId] = React.useState('');
  const [form, setForm] = React.useState<CategoryForm>(INITIAL_FORM);
  const [notice, setNotice] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadCategories = React.useCallback(async () => {
    if (!adminToken || !apiBase) return;
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/api/categories/admin`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load categories.');
      }
      setItems(Array.isArray(payload.data) ? payload.data : []);
    } catch (error: unknown) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to load categories.' });
    } finally {
      setLoading(false);
    }
  }, [adminToken, apiBase]);

  React.useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  React.useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const resetForm = () => {
    setEditingId('');
    setForm(INITIAL_FORM);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!adminToken || !apiBase) return;

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.slug || form.name),
      description: form.description.trim(),
      iconName: form.iconName,
    };

    if (!payload.name) {
      setNotice({ type: 'error', message: 'Category name is required.' });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${apiBase}/api/categories/admin${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to save category.');
      }
      setNotice({ type: 'success', message: editingId ? 'Category updated successfully.' : 'Category created successfully.' });
      resetForm();
      await loadCategories();
    } catch (error: unknown) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to save category.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!adminToken || !apiBase) return;
    setDeletingId(id);
    try {
      const response = await fetch(`${apiBase}/api/categories/admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to delete category.');
      }
      if (editingId === id) {
        resetForm();
      }
      setNotice({ type: 'success', message: 'Category deleted successfully.' });
      await loadCategories();
    } catch (error: unknown) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to delete category.' });
    } finally {
      setDeletingId('');
    }
  };

  const startEditing = (item: CategoryItem) => {
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      iconName: item.iconName || 'ShieldCheck',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {notice ? (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              notice.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
            }`}
          >
            {notice.message}
          </div>
        ) : null}

        <div className="rounded-[24px] bg-white p-6 shadow-sm dark:bg-navy-800">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#2286BE]">Categories</p>
          <h1 className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">Manage Service Categories</h1>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">
            Edit default categories, remove old ones, or create brand new categories from the admin dashboard.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <form onSubmit={handleSubmit} className="rounded-[24px] bg-white p-6 shadow-sm dark:bg-navy-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-700 dark:text-white">{editingId ? 'Edit Category' : 'Create New Category'}</h2>
              {editingId ? (
                <button type="button" onClick={resetForm} className="text-sm font-semibold text-[#2286BE]">
                  Cancel edit
                </button>
              ) : null}
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-navy-700 dark:text-white">Category Name</label>
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                      slug: editingId ? prev.slug : slugify(event.target.value),
                    }))
                  }
                  placeholder="Enter category name"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-700 outline-none transition focus:border-[#2286BE] dark:border-white/10 dark:bg-navy-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-navy-700 dark:text-white">Slug</label>
                <input
                  value={form.slug}
                  onChange={(event) => setForm((prev) => ({ ...prev, slug: slugify(event.target.value) }))}
                  placeholder="category-slug"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-700 outline-none transition focus:border-[#2286BE] dark:border-white/10 dark:bg-navy-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-navy-700 dark:text-white">Description</label>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  rows={4}
                  placeholder="Short category description"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-700 outline-none transition focus:border-[#2286BE] dark:border-white/10 dark:bg-navy-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-navy-700 dark:text-white">Choose Icon</label>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                  {ICON_OPTIONS.map((iconName) => {
                    const isSelected = form.iconName === iconName;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, iconName }))}
                        className={`flex h-12 items-center justify-center rounded-xl border transition ${
                          isSelected
                            ? 'border-[#2286BE] bg-[#2286BE]/10 text-[#2286BE]'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-[#2286BE]/40 dark:border-white/10 dark:bg-navy-700'
                        }`}
                        title={iconName}
                      >
                        {ICONS[iconName]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2286BE] px-5 text-sm font-bold text-white transition hover:bg-[#1b6da0] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>

          <div className="rounded-[24px] bg-white p-6 shadow-sm dark:bg-navy-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-700 dark:text-white">Current Categories</h2>
              <button
                type="button"
                onClick={() => void loadCategories()}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2286BE]"
              >
                <MdRefresh className="h-4 w-4" />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="mt-6 rounded-2xl bg-lightPrimary p-5 text-sm font-semibold text-gray-500 dark:bg-navy-700 dark:text-gray-300">
                Loading categories...
              </div>
            ) : items.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-lightPrimary p-5 text-sm font-semibold text-gray-500 dark:bg-navy-700 dark:text-gray-300">
                No categories found.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-navy-900"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lightPrimary text-[#2286BE] dark:bg-navy-700">
                            {ICONS[item.iconName || 'ShieldCheck'] || ICONS.ShieldCheck}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            {item.count || 0} gigs
                          </span>
                        </div>
                        <h3 className="mt-3 text-base font-bold text-navy-700 dark:text-white">{item.name}</h3>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{item.slug}</p>
                        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-300">
                          {item.description || 'No description added.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(item)}
                          className="rounded-xl border border-[#2286BE]/20 bg-[#2286BE]/5 px-4 py-2 text-sm font-semibold text-[#2286BE] transition hover:bg-[#2286BE]/10"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {deletingId === item._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
