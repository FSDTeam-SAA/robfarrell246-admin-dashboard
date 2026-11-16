"use client";

import { Bell, ChevronDown, LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  type AppNotification,
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationUnreadCount,
  useNotifications,
} from "./notification-api";

const notificationHref = (notification: AppNotification) => {
  if (!notification.refId) return null;

  switch (notification.type) {
    case "CREDITS_ADDED":
      return "/credit";
    case "NEW_PURCHASE":
      return "/transactions";
    case "TICKET_REPLY":
    case "TICKET_STATUS":
    case "NEW_TICKET":
    case "TICKET_CUSTOMER_REPLY":
      return `/help-support?ticket=${encodeURIComponent(notification.refId)}`;
    default:
      return null;
  }
};

const NotificationModal = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const unreadCountQuery = useNotificationUnreadCount();
  const notificationsQuery = useNotifications(tab, open);
  const markAllRead = useMarkAllNotificationsRead();
  const markNotificationRead = useMarkNotificationRead();
  const deleteNotification = useDeleteNotification();
  const notifications = notificationsQuery.data?.notifications ?? [];
  const unreadCount = unreadCountQuery.data ?? notificationsQuery.data?.unreadCount ?? 0;
  const mutationError = markAllRead.error || markNotificationRead.error || deleteNotification.error;
  const mutationErrorMessage = mutationError instanceof Error ? mutationError.message : null;

  const handleNotificationClick = (notification: AppNotification) => {
    const href = notificationHref(notification);
    const openNotification = () => {
      if (!href) return;
      setOpen(false);
      router.push(href);
    };

    if (notification.isRead) {
      openNotification();
      return;
    }

    markNotificationRead.mutate(notification._id, { onSuccess: openNotification });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Open notifications"
          className="relative inline-flex h-[36px] w-[36px] items-center justify-center rounded-[3px] border border-[#E0E7F0] bg-white text-[#73829A] transition hover:bg-[#F6F9FC]"
        >
          <Bell className="h-4 w-4" strokeWidth={1.8} />
          {unreadCount > 0 && <span className="absolute right-[7px] top-[7px] flex h-3 w-3 items-center justify-center rounded-full bg-[#EF4B55] text-[7px] font-bold text-white">{unreadCount}</span>}
        </button>
      </DialogTrigger>

      <DialogContent
        overlayClassName="bg-[#EAF0F7]/70 backdrop-blur-[5px]"
        className="w-[calc(100%-2rem)] max-w-[423px] gap-0 rounded-[14px] border-0 bg-white p-5 shadow-[0_14px_36px_rgba(42,58,83,0.20)] [&>button]:hidden"
      >
        <DialogTitle className="text-[18px] font-semibold leading-5 tracking-[-0.02em] text-[#172238]">Notifications</DialogTitle>
        <DialogDescription className="mt-1 text-[12px] leading-4 text-[#6F809C]">
          {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
        </DialogDescription>

        <button type="button" onClick={() => markAllRead.mutate()} disabled={unreadCount === 0 || markAllRead.isPending} className="absolute right-10 top-5 text-[12px] font-medium text-[#285DE7] transition hover:text-[#0B47D4] disabled:cursor-not-allowed disabled:opacity-50">
          Mark All Read
        </button>
        <ChevronDown className="absolute right-5 top-5 h-4 w-4 text-[#C9D1DC]" strokeWidth={2} />

        <div className="mt-5 grid grid-cols-2 rounded-md bg-[#F6F8FC] p-1">
          <button type="button" onClick={() => setTab("all")} className={`h-7 rounded-md text-[12px] font-medium transition ${tab === "all" ? "bg-[#285DE7] text-white shadow-sm" : "text-[#647792] hover:bg-white"}`}>All</button>
          <button type="button" onClick={() => setTab("unread")} className={`h-7 rounded-md text-[12px] font-medium transition ${tab === "unread" ? "bg-[#285DE7] text-white shadow-sm" : "text-[#647792] hover:bg-white"}`}>Unread ({unreadCount})</button>
        </div>

        {mutationErrorMessage && <p role="alert" className="mt-3 rounded-md bg-[#FFF4F4] px-3 py-2 text-[11px] text-[#C43B43]">{mutationErrorMessage}</p>}

        <div className="mt-3 max-h-[165px] space-y-2 overflow-y-auto pr-3 [scrollbar-color:#252C39_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#252C39] [&::-webkit-scrollbar]:w-2">
          {notificationsQuery.isLoading ? <div className="space-y-2 py-1" aria-label="Loading notifications"><div className="h-[54px] animate-pulse rounded-md bg-[#F1F4F8]" /><div className="h-[54px] animate-pulse rounded-md bg-[#F1F4F8]" /></div> : notificationsQuery.isError ? <div className="rounded-md bg-[#FFF4F4] px-3 py-4 text-center text-[12px] text-[#C43B43]"><p>{notificationsQuery.error.message}</p><button type="button" onClick={() => notificationsQuery.refetch()} className="mt-2 font-medium text-[#285DE7] hover:underline">Try again</button></div> : notifications.length ? notifications.map((notification) => (
            <article key={notification._id} onClick={() => handleNotificationClick(notification)} className={`relative rounded-md border-l-2 bg-[#F7F9FD] px-3 py-2 pr-8 ${notification.isRead ? "border-l-transparent" : "border-[#2D62EC]"} ${!notification.isRead || notificationHref(notification) ? "cursor-pointer" : ""}`}>
              <h3 className="text-[14px] font-medium leading-4 text-[#1C273B]">{notification.title}</h3>
              <p className="mt-1 text-[10px] leading-[13px] text-[#71819A]">{notification.message}</p>
              <button type="button" aria-label={`Delete ${notification.title}`} onClick={(event) => { event.stopPropagation(); deleteNotification.mutate(notification._id); }} disabled={deleteNotification.isPending} className="absolute right-2 top-2 text-[#EF3036] transition hover:text-[#C51B22] disabled:cursor-not-allowed disabled:opacity-50">
                {deleteNotification.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.7} /> : <Trash2 className="h-4 w-4" strokeWidth={1.7} />}
              </button>
            </article>
          )) : <p className="py-7 text-center text-sm text-[#71819A]">No notifications to show.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
