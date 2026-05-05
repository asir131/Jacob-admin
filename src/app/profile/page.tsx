'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSessionUser } from '@/store/slices/authSlice';
import { getStoredAdminToken, storeAdminSession } from '@/lib/auth';
import { MdEdit, MdLock, MdPerson, MdPhotoCamera } from 'react-icons/md';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

type AdminAccount = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt?: string | null;
};

type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

const buildAdminEmail = (name: string) => {
  const clean = name
    .trim()
    .toLowerCase()
    .replace(/@admin\.com$/i, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '');

  return `${clean || 'admin'}@admin.com`;
};

const getJson = async <T,>(response: Response) => {
  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
    data?: T;
  } | null;

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || 'Request failed.');
  }

  return payload.data as T;
};

export default function Profile() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);
  const user = session?.user;
  const isSuperAdmin = user?.role === 'superAdmin' || user?.email?.toLowerCase() === 'admin@admin.com';

  const [avatarBusy, setAvatarBusy] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editConfirmPassword, setEditConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const resolvedLastName =
    user?.role === 'admin' && user?.lastName?.toLowerCase() === 'user' ? '' : user?.lastName || '';
  const displayName = `${user?.firstName || ''} ${resolvedLastName}`.trim() || user?.email || 'Admin';
  const generatedEmail = useMemo(() => buildAdminEmail(createName), [createName]);

  const authHeaders = (): Record<string, string> => {
    const token = getStoredAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadAdmins = async (nextPage = page) => {
    if (!isSuperAdmin || !API_BASE) return;
    setLoadingAdmins(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/profile/admin/admins?page=${nextPage}&limit=8`, {
        headers: {
          ...authHeaders(),
          Accept: 'application/json',
        },
      });
      const data = await getJson<{ items: AdminAccount[]; pagination: Pagination }>(response);
      setAdmins(data.items || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load admins.');
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    loadAdmins(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdmin, page]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !API_BASE || !session) return;

    setAvatarBusy(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE}/api/profile/avatar`, {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
      });
      const data = await getJson<{ avatarUrl?: string; user?: { avatar?: string } }>(response);
      const avatar = data.avatarUrl || data.user?.avatar || '';

      const nextSession = {
        ...session,
        user: {
          ...session.user,
          avatar,
        },
      };

      storeAdminSession(nextSession);
      dispatch(updateSessionUser({ avatar }));
      setMessage('Profile image updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile image upload failed.');
    } finally {
      setAvatarBusy(false);
      event.target.value = '';
    }
  };

  const createAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!API_BASE) return;
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/api/profile/admin/admins`, {
        method: 'POST',
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: createName,
          password: createPassword,
        }),
      });
      await getJson(response);
      setCreateName('');
      setCreatePassword('');
      setMessage('Admin created successfully.');
      setPage(1);
      await loadAdmins(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create admin.');
    }
  };

  const startEdit = (admin: AdminAccount) => {
    setEditingId(admin.id);
    setEditName(admin.name);
    setEditPassword('');
    setEditConfirmPassword('');
    setError('');
    setMessage('');
  };

  const saveAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!API_BASE || !editingId) return;
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/api/profile/admin/admins/${editingId}`, {
        method: 'PATCH',
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: editName,
          newPassword: editPassword,
          confirmPassword: editConfirmPassword,
        }),
      });
      await getJson(response);
      setEditingId('');
      setEditName('');
      setEditPassword('');
      setEditConfirmPassword('');
      setMessage('Admin updated successfully.');
      await loadAdmins(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update admin.');
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-navy-800">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative h-24 w-24 overflow-hidden rounded-full bg-[#2286BE]/10 ring-4 ring-white">
                {user?.avatar ? (
                  <img src={user.avatar} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-[#2286BE]">
                    <MdPerson />
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#2286BE]">
                  {isSuperAdmin ? 'Super Admin' : 'Admin'}
                </p>
                <h1 className="mt-2 text-3xl font-bold text-navy-700 dark:text-white">{displayName}</h1>
                <p className="mt-1 text-sm font-medium text-gray-500">{user?.email}</p>
              </div>
            </div>

            <label className="inline-flex h-12 cursor-pointer items-center justify-center rounded-2xl bg-[#2286BE] px-5 text-sm font-bold text-white transition hover:opacity-90">
              <MdPhotoCamera className="mr-2 h-5 w-5" />
              {avatarBusy ? 'Uploading...' : 'Upload Profile Image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={avatarBusy}
                onChange={handleAvatarUpload}
              />
            </label>
          </div>
        </div>

        {message ? <div className="rounded-2xl bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">{message}</div> : null}
        {error ? <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-bold text-red-600">{error}</div> : null}

        {isSuperAdmin ? (
          <>
            <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-navy-800">
              <h2 className="text-2xl font-bold text-navy-700 dark:text-white">Create Account</h2>
              <p className="mt-1 text-sm font-medium text-gray-500">
                Type a name. The admin email is generated automatically with @admin.com.
              </p>

              <form onSubmit={createAdmin} className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-bold text-navy-700 dark:text-white">Name</label>
                  <input
                    value={createName}
                    onChange={(event) => setCreateName(event.target.value)}
                    placeholder="operations admin"
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-[#F4F7FE] px-4 text-sm font-medium outline-none focus:border-[#2286BE]"
                  />
                  <p className="mt-2 text-xs font-bold text-[#2286BE]">{generatedEmail}</p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-navy-700 dark:text-white">Password</label>
                  <input
                    type="password"
                    value={createPassword}
                    onChange={(event) => setCreatePassword(event.target.value)}
                    placeholder="Minimum 8 characters"
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-[#F4F7FE] px-4 text-sm font-medium outline-none focus:border-[#2286BE]"
                  />
                </div>
                <div className="flex items-end">
                  <button className="h-12 mb-6 w-full rounded-2xl bg-[#2286BE] px-5 text-sm font-bold text-white transition hover:opacity-90">
                    Create Account
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-navy-800">
              <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-navy-700 dark:text-white">Admins</h2>
                  <p className="mt-1 text-sm font-medium text-gray-500">View and edit normal admin accounts.</p>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                  {pagination?.totalItems || 0} admins
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <div className="grid grid-cols-12 bg-[#F4F7FE] px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <div className="col-span-5">Admin</div>
                  <div className="col-span-4">ID</div>
                  <div className="col-span-3 text-right">Action</div>
                </div>

                {loadingAdmins ? (
                  <div className="px-4 py-8 text-center text-sm font-bold text-gray-500">Loading admins...</div>
                ) : admins.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm font-bold text-gray-500">No admins created yet.</div>
                ) : (
                  admins.map((admin) => (
                    <div key={admin.id} className="border-t border-gray-100 px-4 py-4">
                      <div className="grid grid-cols-12 items-center gap-3">
                        <div className="col-span-12 flex items-center gap-3 md:col-span-5">
                          {admin.avatar ? (
                            <img src={admin.avatar} alt={admin.name} className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2286BE]/10 text-[#2286BE]">
                              <MdPerson />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-navy-700 dark:text-white">{admin.name}</p>
                            <p className="text-xs font-medium text-gray-500">{admin.email}</p>
                          </div>
                        </div>
                        <div className="col-span-12 break-all text-xs font-bold text-gray-500 md:col-span-4">{admin.id}</div>
                        <div className="col-span-12 flex justify-start md:col-span-3 md:justify-end">
                          <button
                            type="button"
                            onClick={() => startEdit(admin)}
                            className="inline-flex items-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-navy-700 transition hover:border-[#2286BE] hover:text-[#2286BE]"
                          >
                            <MdEdit className="mr-2" /> Edit
                          </button>
                        </div>
                      </div>

                      {editingId === admin.id ? (
                        <form onSubmit={saveAdmin} className="mt-4 grid grid-cols-1 gap-3 rounded-2xl bg-[#F8FAFC] p-4 lg:grid-cols-4">
                          <input
                            value={editName}
                            onChange={(event) => setEditName(event.target.value)}
                            placeholder="Change name"
                            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium outline-none focus:border-[#2286BE]"
                          />
                          <input
                            type="password"
                            value={editPassword}
                            onChange={(event) => setEditPassword(event.target.value)}
                            placeholder="New pass"
                            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium outline-none focus:border-[#2286BE]"
                          />
                          <input
                            type="password"
                            value={editConfirmPassword}
                            onChange={(event) => setEditConfirmPassword(event.target.value)}
                            placeholder="Confirm pass"
                            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium outline-none focus:border-[#2286BE]"
                          />
                          <div className="flex gap-2">
                            <button className="h-11 flex-1 rounded-xl bg-[#2286BE] px-4 text-sm font-bold text-white">Save</button>
                            <button
                              type="button"
                              onClick={() => setEditingId('')}
                              className="h-11 flex-1 rounded-xl border border-gray-200 px-4 text-sm font-bold text-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : null}
                    </div>
                  ))
                )}
              </div>

              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={!pagination?.hasPrevPage || loadingAdmins}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-600 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  {pagination?.page || page} / {pagination?.totalPages || 1}
                </span>
                <button
                  type="button"
                  disabled={!pagination?.hasNextPage || loadingAdmins}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-600 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-navy-800">
            <div className="flex items-center gap-3 text-gray-500">
              <MdLock className="h-6 w-6 text-[#2286BE]" />
              <p className="text-sm font-bold">
                Admin creation and admin list are available only for the super admin.
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
