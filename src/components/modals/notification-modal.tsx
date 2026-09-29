"use client";

import { Bell, ChevronDown, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Notification = {
  id: number;
  title: string;
  description: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Property Analysis Ready",
    description: "123 Market Suite 104 analysis is complete with Top 3 tenant concepts and Fit Scores.",
    read: false,
  },
  {
    id: 2,
    title: "AI Concept Renderings Generated",
    description: "3 photorealistic conceptual visualizations are ready for 123 Market Street.",
    read: false,
  },
  {
    id: 3,
    title: "Monthly Credits Grant",
    description: "100 Credits have been credited to your Broker Pro account balance.",
    read: false,
  },
];

const NotificationModal = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const visibleNotifications = useMemo(
    () => notifications.filter((notification) => tab === "all" || !notification.read),
    [notifications, tab],
  );

  const markAllRead = () => setNotifications((items) => items.map((item) => ({ ...item, read: true })));
  const removeNotification = (id: number) => setNotifications((items) => items.filter((item) => item.id !== id));

  return (
    <Dialog>
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

        <button type="button" onClick={markAllRead} className="absolute right-10 top-5 text-[12px] font-medium text-[#285DE7] transition hover:text-[#0B47D4]">
          Mark All Read
        </button>
        <ChevronDown className="absolute right-5 top-5 h-4 w-4 text-[#C9D1DC]" strokeWidth={2} />

        <div className="mt-5 grid grid-cols-2 rounded-md bg-[#F6F8FC] p-1">
          <button type="button" onClick={() => setTab("all")} className={`h-7 rounded-md text-[12px] font-medium transition ${tab === "all" ? "bg-[#285DE7] text-white shadow-sm" : "text-[#647792] hover:bg-white"}`}>All</button>
          <button type="button" onClick={() => setTab("unread")} className={`h-7 rounded-md text-[12px] font-medium transition ${tab === "unread" ? "bg-[#285DE7] text-white shadow-sm" : "text-[#647792] hover:bg-white"}`}>Unread ({unreadCount})</button>
        </div>

        <div className="mt-3 max-h-[165px] space-y-2 overflow-y-auto pr-3 [scrollbar-color:#252C39_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#252C39] [&::-webkit-scrollbar]:w-2">
          {visibleNotifications.length ? visibleNotifications.map((notification) => (
            <article key={notification.id} className="relative rounded-md border-l-2 border-[#2D62EC] bg-[#F7F9FD] px-3 py-2 pr-8">
              <h3 className="text-[14px] font-medium leading-4 text-[#1C273B]">{notification.title}</h3>
              <p className="mt-1 text-[10px] leading-[13px] text-[#71819A]">{notification.description}</p>
              <button type="button" aria-label={`Delete ${notification.title}`} onClick={() => removeNotification(notification.id)} className="absolute right-2 top-2 text-[#EF3036] transition hover:text-[#C51B22]">
                <Trash2 className="h-4 w-4" strokeWidth={1.7} />
              </button>
            </article>
          )) : <p className="py-7 text-center text-sm text-[#71819A]">No notifications to show.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
