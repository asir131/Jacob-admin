'use client';

import React from 'react';
import { io, type Socket } from 'socket.io-client';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearSupportNotice,
  deleteSupportMessages,
  fetchSupportMessages,
  setSupportMessageConversationId,
  setSupportNotice,
  setSupportPage,
  toggleSupportCurrentPageSelected,
  toggleSupportMessageSelected,
  updateSupportStatus,
  type SupportMessage,
  type SupportUser,
} from '@/store/slices/supportMessagesSlice';

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

type SupportMessageGroup = {
  key: string;
  latest: SupportMessage;
  tickets: SupportMessage[];
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
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);
  const {
    deletingSelected,
    items,
    loading,
    notice,
    pagination,
    selectedIds,
    statusBusyId,
  } = useAppSelector((state) => state.supportMessages);
  const latestSupportNotificationId = useAppSelector(
    (state) =>
      state.adminNotifications.items.find((item) => item.notificationType === 'support_message')?.id || '',
  );
  const adminToken = session?.accessToken || '';
  const adminUserId = session?.user?.id || '';
  const [chatBusyId, setChatBusyId] = React.useState('');
  const [activeSupport, setActiveSupport] = React.useState<SupportMessage | null>(null);
  const [activeConversation, setActiveConversation] = React.useState<SupportConversation | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const socketRef = React.useRef<Socket | null>(null);
  const currentPageIds = React.useMemo(() => items.map((item) => item.id), [items]);
  const groupedItems = React.useMemo<SupportMessageGroup[]>(() => {
    const map = new Map<string, SupportMessageGroup>();

    items.forEach((item) => {
      const key = item.userId || item.user?.id || item.email.toLowerCase() || item.id;
      const existing = map.get(key);

      if (!existing) {
        map.set(key, {
          key,
          latest: item,
          tickets: [item],
        });
        return;
      }

      existing.tickets.push(item);
      const existingTime = new Date(existing.latest.createdAt || 0).getTime();
      const itemTime = new Date(item.createdAt || 0).getTime();
      if (itemTime > existingTime) {
        existing.latest = item;
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.latest.createdAt || 0).getTime() - new Date(a.latest.createdAt || 0).getTime(),
    );
  }, [items]);
  const selectedCount = selectedIds.length;
  const allCurrentPageSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));

  const loadMessages = React.useCallback(async () => {
    if (!apiBase || !adminToken) return;
    await dispatch(fetchSupportMessages({ apiBase, adminToken, page: pagination.page, limit: PAGE_SIZE }));
  }, [adminToken, apiBase, dispatch, pagination.page]);

  React.useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  React.useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => dispatch(clearSupportNotice()), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [dispatch, notice]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, activeConversation]);

  const toggleSelectCurrentPage = () => {
    dispatch(toggleSupportCurrentPageSelected());
  };

  const toggleGroupSelected = (group: SupportMessageGroup) => {
    const groupIds = group.tickets.map((ticket) => ticket.id);
    const allSelected = groupIds.every((id) => selectedIds.includes(id));
    groupIds.forEach((id) => {
      const selected = selectedIds.includes(id);
      if ((allSelected && selected) || (!allSelected && !selected)) {
        dispatch(toggleSupportMessageSelected(id));
      }
    });
  };

  const deleteSelectedMessages = async () => {
    if (!apiBase || !adminToken || selectedIds.length === 0) return;
    const confirmed = window.confirm(`Delete ${selectedIds.length} selected support message(s)? This cannot be undone.`);
    if (!confirmed) return;

    const deleteIds = selectedIds;
    const result = await dispatch(deleteSupportMessages({ apiBase, adminToken, ids: deleteIds }));
    if (deleteSupportMessages.fulfilled.match(result)) {
      if (activeSupport?.id && deleteIds.includes(activeSupport.id)) {
        closeInbox();
      }
      const remainingOnPage = items.filter((item) => !deleteIds.includes(item.id)).length;
      if (remainingOnPage === 0 && pagination.page > 1) {
        dispatch(setSupportPage(Math.max(1, pagination.page - 1)));
      } else {
        await loadMessages();
      }
    }
  };

  React.useEffect(() => {
    if (!latestSupportNotificationId) return;
    void loadMessages();
  }, [latestSupportNotificationId, loadMessages]);

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
    await dispatch(updateSupportStatus({ apiBase, adminToken, id, status }));
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
      dispatch(setSupportMessageConversationId({ id: item.id, conversationId: conversation.id }));
    } catch (error: unknown) {
      dispatch(setSupportNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to open inbox.' }));
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
        dispatch(setSupportMessageConversationId({ id: activeSupport.id, conversationId: activeConversation.id }));
      }
    } catch (error: unknown) {
      dispatch(setSupportNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to send message.' }));
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
          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-lightPrimary p-4 dark:border-white/10 dark:bg-navy-700 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={allCurrentPageSelected}
                  onChange={toggleSelectCurrentPage}
                  disabled={loading || currentPageIds.length === 0}
                  className="h-4 w-4 rounded border-gray-300 accent-[#2286BE]"
                />
                Select page
              </label>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                {selectedCount ? `${selectedCount} selected` : `${pagination.totalItems} total messages`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => void deleteSelectedMessages()}
              disabled={selectedCount === 0 || deletingSelected}
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deletingSelected ? 'Deleting...' : `Delete Selected${selectedCount ? ` (${selectedCount})` : ''}`}
            </button>
          </div>

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
              {groupedItems.map((group) => {
                const item = group.latest;
                const groupIds = group.tickets.map((ticket) => ticket.id);
                const groupSelected = groupIds.length > 0 && groupIds.every((id) => selectedIds.includes(id));
                const pendingCount = group.tickets.filter((ticket) => ticket.status === 'pending').length;
                return (
                <div key={group.key} className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-navy-900">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex min-w-0 flex-1 gap-4">
                      <label className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center">
                        <input
                          type="checkbox"
                          checked={groupSelected}
                          onChange={() => toggleGroupSelected(group)}
                          className="h-4 w-4 rounded border-gray-300 accent-[#2286BE]"
                          aria-label={`Select support messages from ${item.fullName}`}
                        />
                      </label>
                      <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                          {pendingCount ? `${pendingCount} pending` : item.status}
                        </span>
                        <span className="rounded-full bg-[#2286BE]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#2286BE]">
                          New ticket: {item.subject}
                        </span>
                        <span className="text-xs font-semibold text-gray-400">{formatDate(item.createdAt)}</span>
                      </div>
                      <h2 className="mt-3 text-lg font-bold text-navy-700 dark:text-white">{item.fullName}</h2>
                      <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-300">
                        {item.email} · {group.tickets.length} ticket{group.tickets.length === 1 ? '' : 's'}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.message}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {group.tickets.map((ticket) => (
                          <button
                            key={ticket.id}
                            type="button"
                            onClick={() => void openInbox(ticket)}
                            className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                              ticket.id === item.id
                                ? 'bg-[#2286BE] text-white hover:bg-[#1b75a8]'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-gray-200'
                            }`}
                            title={ticket.message}
                          >
                            {ticket.id === item.id ? 'New: ' : ''}
                            {ticket.subject}
                          </button>
                        ))}
                      </div>
                      </div>
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
              );
              })}

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-gray-100 px-4 py-3 dark:border-white/10">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                    Page {pagination.page} of {pagination.totalPages} - {pagination.totalItems} messages
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => dispatch(setSupportPage(Math.max(1, pagination.page - 1)))}
                      disabled={!pagination.hasPrevPage}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch(setSupportPage(Math.min(pagination.totalPages, pagination.page + 1)))}
                      disabled={!pagination.hasNextPage}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                    >
                      Next
                    </button>
                  </div>
                </div>
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
