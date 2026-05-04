'use client';

import React from 'react';
import { io, type Socket } from 'socket.io-client';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAppSelector } from '@/store/hooks';

type SupportUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
};

type SupportMessage = {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'solved' | 'ignored';
  userId?: string | null;
  conversationId?: string | null;
  user?: SupportUser | null;
  createdAt?: string | null;
};

type ChatMessage = {
  id: string;
  conversationId?: string;
  senderId: string;
  receiverId?: string;
  text: string;
  messageType?: string;
  createdAt?: string | null;
};

type SupportConversation = {
  id: string;
  lastMessage?: string;
  lastMessageAt?: string | null;
  otherUser?: SupportUser | null;
};

type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

const PAGE_SIZE = 15;

const formatDate = (value?: string | null) => {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleString();
};

const getDisplayName = (item?: SupportMessage | null, conversation?: SupportConversation | null) => {
  return (
    conversation?.otherUser?.name ||
    item?.user?.name ||
    `${item?.user?.firstName || ''} ${item?.user?.lastName || ''}`.trim() ||
    item?.fullName ||
    'Customer'
  );
};

export default function SupportPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || '';
  const session = useAppSelector((state) => state.auth.session);
  const adminToken = session?.accessToken || '';
  const adminUserId = session?.user?.id || '';
  const [items, setItems] = React.useState<SupportMessage[]>([]);
  const [pagination, setPagination] = React.useState<Pagination>({
    page: 1,
    limit: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = React.useState(true);
  const [statusBusyId, setStatusBusyId] = React.useState('');
  const [chatBusyId, setChatBusyId] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [notice, setNotice] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeSupport, setActiveSupport] = React.useState<SupportMessage | null>(null);
  const [activeConversation, setActiveConversation] = React.useState<SupportConversation | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const socketRef = React.useRef<Socket | null>(null);

  const loadMessages = React.useCallback(async () => {
    if (!apiBase || !adminToken) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      const response = await fetch(`${apiBase}/api/support/admin?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load support messages.');
      }

      const nextItems = Array.isArray(payload?.data?.items)
        ? (payload.data.items as SupportMessage[])
        : Array.isArray(payload?.data)
          ? (payload.data as SupportMessage[])
          : [];
      const nextPagination = payload?.data?.pagination as Pagination | undefined;

      setItems(nextItems);
      setPagination(
        nextPagination || {
          page,
          limit: PAGE_SIZE,
          totalItems: nextItems.length,
          totalPages: Math.max(1, Math.ceil(nextItems.length / PAGE_SIZE)),
          hasNextPage: false,
          hasPrevPage: page > 1,
        },
      );
    } catch (error: unknown) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to load support messages.' });
    } finally {
      setLoading(false);
    }
  }, [adminToken, apiBase, page]);

  React.useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  React.useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, activeConversation]);

  React.useEffect(() => {
    if (!socketUrl || !adminToken || !activeConversation?.id) return;

    const socket = io(socketUrl, {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: `Bearer ${adminToken}`,
      },
    });
    socketRef.current = socket;

    socket.on('chat:message:new', (payload: ChatMessage) => {
      if (!payload?.conversationId || payload.conversationId !== activeConversation.id) return;
      setMessages((current) => (current.some((item) => item.id === payload.id) ? current : [...current, payload]));
    });

    socket.on('chat:conversation:updated', (payload: { conversationId?: string; lastMessage?: string; lastMessageAt?: string | null }) => {
      if (payload.conversationId !== activeConversation.id) return;
      setActiveConversation((current) =>
        current
          ? {
              ...current,
              lastMessage: payload.lastMessage || current.lastMessage,
              lastMessageAt: payload.lastMessageAt || current.lastMessageAt,
            }
          : current,
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [activeConversation?.id, adminToken, socketUrl]);

  const updateStatus = async (id: string, status: 'solved' | 'ignored') => {
    if (!apiBase || !adminToken) return;
    setStatusBusyId(id);
    try {
      const response = await fetch(`${apiBase}/api/support/admin/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to update support message.');
      }
      const updatedItem = payload?.data as SupportMessage | undefined;
      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status: updatedItem?.status || status,
              }
            : item,
        ),
      );
      setNotice({ type: 'success', message: `Message marked as ${status}.` });
    } catch (error: unknown) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to update support message.' });
    } finally {
      setStatusBusyId('');
    }
  };

  const openInbox = async (item: SupportMessage) => {
    if (!apiBase || !adminToken) return;
    setChatBusyId(item.id);
    try {
      const response = await fetch(`${apiBase}/api/support/admin/${item.id}/conversation`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to open inbox.');
      }

      const conversation = payload?.data?.conversation as SupportConversation | undefined;
      const supportMessage = payload?.data?.supportMessage as SupportMessage | undefined;
      const nextMessages = Array.isArray(payload?.data?.messages) ? (payload.data.messages as ChatMessage[]) : [];

      if (!conversation?.id) {
        throw new Error('Conversation was not created.');
      }

      const nextSupport = supportMessage || { ...item, conversationId: conversation.id };
      setActiveConversation(conversation);
      setActiveSupport(nextSupport);
      setMessages(nextMessages);
      setChatInput('');
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                ...nextSupport,
                conversationId: conversation.id,
              }
            : entry,
        ),
      );
    } catch (error: unknown) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to open inbox.' });
    } finally {
      setChatBusyId('');
    }
  };

  const closeInbox = () => {
    setActiveConversation(null);
    setActiveSupport(null);
    setMessages([]);
    setChatInput('');
  };

  const sendMessage = async () => {
    const text = chatInput.trim();
    if (!apiBase || !adminToken || !activeConversation?.id || !text) return;

    setSending(true);
    try {
      const formData = new FormData();
      formData.append('text', text);

      const response = await fetch(`${apiBase}/api/chats/conversations/${activeConversation.id}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to send message.');
      }

      const sentMessage = payload.data as ChatMessage;
      setMessages((current) => (current.some((item) => item.id === sentMessage.id) ? current : [...current, sentMessage]));
      setChatInput('');
      setActiveConversation((current) =>
        current
          ? {
              ...current,
              lastMessage: sentMessage.text,
              lastMessageAt: sentMessage.createdAt || new Date().toISOString(),
            }
          : current,
      );
      if (activeSupport?.id) {
        setItems((current) =>
          current.map((item) =>
            item.id === activeSupport.id
              ? {
                  ...item,
                  conversationId: activeConversation.id,
                }
              : item,
          ),
        );
      }
    } catch (error: unknown) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to send message.' });
    } finally {
      setSending(false);
    }
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
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#2286BE]">Support</p>
          <h1 className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">Contact Messages</h1>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">
            Messages submitted from the website contact page will appear here.
          </p>
        </div>

        <div className="rounded-[24px] bg-white p-6 shadow-sm dark:bg-navy-800">
          {loading ? (
            <div className="rounded-2xl bg-lightPrimary p-5 text-sm font-semibold text-gray-500 dark:bg-navy-700 dark:text-gray-300">
              Loading support messages...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl bg-lightPrimary p-5 text-sm font-semibold text-gray-500 dark:bg-navy-700 dark:text-gray-300">
              No support messages yet.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-navy-900">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                          {item.status}
                        </span>
                        <span className="text-xs font-semibold text-gray-400">{formatDate(item.createdAt)}</span>
                      </div>
                      <h2 className="mt-3 text-lg font-bold text-navy-700 dark:text-white">{item.subject}</h2>
                      <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-300">
                        {item.fullName} - {item.email}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.message}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      <button
                        type="button"
                        onClick={() => void openInbox(item)}
                        disabled={chatBusyId === item.id}
                        className="rounded-xl border border-[#2286BE]/25 bg-[#2286BE] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1b75a8] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {chatBusyId === item.id ? 'Opening...' : item.conversationId ? 'Open Inbox' : 'Start Inbox'}
                      </button>
                      {item.status === 'pending' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => void updateStatus(item.id, 'solved')}
                            disabled={statusBusyId === item.id}
                            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Solved
                          </button>
                          <button
                            type="button"
                            onClick={() => void updateStatus(item.id, 'ignored')}
                            disabled={statusBusyId === item.id}
                            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Ignore
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}

              {pagination.totalPages > 1 ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-gray-100 px-4 py-3 dark:border-white/10">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                    Page {pagination.page} of {pagination.totalPages} - {pagination.totalItems} messages
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={!pagination.hasPrevPage}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
                      disabled={!pagination.hasNextPage}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {activeConversation ? (
        <div className="fixed inset-0 z-[80] flex justify-end bg-slate-950/35 p-3 backdrop-blur-sm sm:p-5">
          <div className="flex h-full w-full max-w-xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl dark:bg-navy-900">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#2286BE]">Support Inbox</p>
                  <h2 className="mt-2 truncate text-xl font-bold text-navy-700 dark:text-white">
                    {getDisplayName(activeSupport, activeConversation)}
                  </h2>
                  <p className="mt-1 truncate text-sm font-semibold text-gray-500 dark:text-gray-300">
                    {activeConversation.otherUser?.email || activeSupport?.email || 'No email'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeInbox}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                >
                  Close
                </button>
              </div>
              {activeSupport ? (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Ticket</p>
                  <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white">{activeSupport.subject}</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-gray-300">{activeSupport.message}</p>
                </div>
              ) : null}
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 px-5 py-4 dark:bg-navy-800/60">
              {messages.length === 0 ? (
                <div className="rounded-2xl bg-white p-5 text-sm font-semibold text-gray-500 shadow-sm dark:bg-navy-900 dark:text-gray-300">
                  No messages in this conversation yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => {
                    const mine = String(message.senderId) === String(adminUserId);
                    return (
                      <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                            mine
                              ? 'bg-[#2286BE] text-white'
                              : 'border border-slate-100 bg-white text-slate-700 dark:border-white/10 dark:bg-navy-900 dark:text-gray-200'
                          }`}
                        >
                          {message.messageType === 'system' ? (
                            <p className={`mb-2 text-[10px] font-black uppercase tracking-[0.2em] ${mine ? 'text-white/70' : 'text-slate-400'}`}>
                              Support Ticket
                            </p>
                          ) : null}
                          <p className="whitespace-pre-wrap leading-6">{message.text}</p>
                          <p className={`mt-2 text-[10px] font-semibold ${mine ? 'text-white/70' : 'text-slate-400'}`}>
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 bg-white p-4 dark:border-white/10 dark:bg-navy-900">
              <div className="flex items-end gap-3">
                <textarea
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Write a reply..."
                  rows={2}
                  className="min-h-[52px] flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#2286BE] dark:border-white/10 dark:bg-navy-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={sending || !chatInput.trim()}
                  className="rounded-2xl bg-[#2286BE] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b75a8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
