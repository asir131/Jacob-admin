'use client';

import React, { useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearFaqNotice,
  fetchFaqs,
  removeFaq,
  resetFaqForm,
  saveFaq,
  setFaqFormField,
  startEditingFaq,
} from '@/store/slices/faqSlice';

export default function FaqsPage() {
  const dispatch = useAppDispatch();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const adminToken = useAppSelector((state) => state.auth.session?.accessToken || '');
  const { items, loading, saving, deletingId, editingId, form, notice } = useAppSelector((state) => state.faqs);

  useEffect(() => {
    if (!adminToken) return;
    void dispatch(fetchFaqs({ apiBase, adminToken }));
  }, [adminToken, apiBase, dispatch]);

  useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => dispatch(clearFaqNotice()), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [dispatch, notice]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await dispatch(
      saveFaq({
        apiBase,
        adminToken,
        faqId: editingId || undefined,
        payload: {
          question: form.question,
          answer: form.answer,
          isActive: form.isActive,
          sortOrder: Number(form.sortOrder || 0),
        },
      })
    );
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
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#2286BE]">Homepage Content</p>
          <h1 className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">Manage Frequently Asked Questions</h1>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">
            These questions and answers will appear in the FAQ section on the website homepage.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <form onSubmit={handleSubmit} className="rounded-[24px] bg-white p-6 shadow-sm dark:bg-navy-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-700 dark:text-white">{editingId ? 'Edit FAQ' : 'Add New FAQ'}</h2>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => dispatch(resetFaqForm())}
                  className="text-sm font-semibold text-[#2286BE]"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-navy-700 dark:text-white">Question</label>
                <input
                  value={form.question}
                  onChange={(event) => dispatch(setFaqFormField({ field: 'question', value: event.target.value }))}
                  placeholder="Write the FAQ question"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-700 outline-none transition focus:border-[#2286BE] dark:border-white/10 dark:bg-navy-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-navy-700 dark:text-white">Answer</label>
                <textarea
                  value={form.answer}
                  onChange={(event) => dispatch(setFaqFormField({ field: 'answer', value: event.target.value }))}
                  rows={6}
                  placeholder="Write the answer shown on the homepage"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-700 outline-none transition focus:border-[#2286BE] dark:border-white/10 dark:bg-navy-900 dark:text-white"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-navy-700 dark:text-white">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(event) =>
                      dispatch(setFaqFormField({ field: 'sortOrder', value: Number(event.target.value || 0) }))
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-700 outline-none transition focus:border-[#2286BE] dark:border-white/10 dark:bg-navy-900 dark:text-white"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-navy-700 dark:border-white/10 dark:text-white">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) => dispatch(setFaqFormField({ field: 'isActive', value: event.target.checked }))}
                    />
                    Show on homepage
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2286BE] px-5 text-sm font-bold text-white transition hover:bg-[#1b6da0] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? 'Saving...' : editingId ? 'Update FAQ' : 'Create FAQ'}
              </button>
            </div>
          </form>

          <div className="rounded-[24px] bg-white p-6 shadow-sm dark:bg-navy-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-700 dark:text-white">Current FAQs</h2>
              <button
                type="button"
                onClick={() => void dispatch(fetchFaqs({ apiBase, adminToken }))}
                className="text-sm font-semibold text-[#2286BE]"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="mt-6 rounded-2xl bg-lightPrimary p-5 text-sm font-semibold text-gray-500 dark:bg-navy-700 dark:text-gray-300">
                Loading FAQs...
              </div>
            ) : items.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-lightPrimary p-5 text-sm font-semibold text-gray-500 dark:bg-navy-700 dark:text-gray-300">
                No FAQs have been added yet.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-navy-900"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            Order {item.sortOrder}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${
                              item.isActive
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {item.isActive ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                        <h3 className="mt-3 text-base font-bold text-navy-700 dark:text-white">{item.question}</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-300">{item.answer}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => dispatch(startEditingFaq(item.id))}
                          className="rounded-xl border border-[#2286BE]/20 bg-[#2286BE]/5 px-4 py-2 text-sm font-semibold text-[#2286BE] transition hover:bg-[#2286BE]/10"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void dispatch(removeFaq({ apiBase, adminToken, faqId: item.id }))}
                          disabled={deletingId === item.id}
                          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {deletingId === item.id ? 'Deleting...' : 'Delete'}
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
