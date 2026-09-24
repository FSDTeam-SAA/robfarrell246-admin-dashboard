"use client";

import {
  BriefcaseBusiness,
  CircleDollarSign,
  LayoutGrid,
  LogOut,
  MessageCircleMore,
  Settings,
  Store,
  Users,
  Coins,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import LogoutModal from "@/components/modals/logout-modal";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import logo from "../../../../public/assets/images/logo.png";
import sidebarMenuBackground from "../../../../public/assets/images/sidebar_menu.png";

const navigationSections = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/", icon: LayoutGrid }],
  },
  {
    label: "Management",
    items: [
      { title: "Users", url: "/users", icon: Users },
      { title: "Projects", url: "/projects", icon: BriefcaseBusiness },
      { title: "Business", url: "/business", icon: Store },
    ],
  },
  {
    label: "Revenue",
    items: [
      { title: "Credit", url: "/credit", icon: Coins },
      { title: "Transactions", url: "/transactions", icon: CircleDollarSign },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Settings", url: "/settings", icon: Settings },
      { title: "Help & Support", url: "/help-support", icon: MessageCircleMore },
    ],
  },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname === url || pathname.startsWith(`${url}/`);

  const handleLogout = async () => {
    try {
      toast.success("Logout successful!");
      await signOut({ callbackUrl: "/login" });
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <>
      <Sidebar className="border-r border-[#D9E0EA] [--sidebar-width:228px]">
        <SidebarContent
          className="scrollbar-hide gap-0 bg-white bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.88), rgba(255,255,255,0.94)), url('/assets/images/dashboard_sidebar_bg.png')",
          }}
        >
          <div className="flex min-h-svh flex-col">
            <div className="flex h-[62px] shrink-0 items-center border-b border-[#DCE3EC] bg-white px-5">
              <Link
                href="/"
                aria-label="Go to dashboard overview"
                className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6FF2] focus-visible:ring-offset-2"
              >
                <Image
                  src={logo}
                  alt="Vision Before Lease"
                  priority
                  className="h-auto w-[188px]"
                />
              </Link>
            </div>

            <nav aria-label="Dashboard navigation" className="flex-1 px-[9px] pb-8 pt-4">
              {navigationSections.map((section, sectionIndex) => (
                <section
                  key={section.label}
                  aria-labelledby={`sidebar-section-${sectionIndex}`}
                  className={sectionIndex === 0 ? "" : "mt-[11px]"}
                >
                  <h2
                    id={`sidebar-section-${sectionIndex}`}
                    className="mb-[15px] px-[13px] text-[0.625rem] font-normal uppercase leading-[1.2] text-[#61718A]"
                  >
                    {section.label}
                  </h2>

                  <ul className="space-y-0">
                    {section.items.map((item) => {
                      const active = isActive(item.url);

                      return (
                        <li key={item.title}>
                          <Link
                            href={item.url}
                            aria-current={active ? "page" : undefined}
                            style={
                              active
                                ? {
                                    backgroundImage: `linear-gradient(rgba(255,255,255,0.56), rgba(255,255,255,0.56)), url('${sidebarMenuBackground.src}')`,
                                    backgroundPosition: "center 48%",
                                    backgroundSize: "cover",
                                  }
                                : undefined
                            }
                            className={`flex h-[30px] items-center gap-[9px] border-y px-[13px] text-[0.75rem] font-normal uppercase leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2F6FF2] ${
                              active
                                ? "border-[#2F6FF2] bg-white/25 text-[#1769FF]"
                                : "border-transparent text-[#52617A] hover:bg-white/45 hover:text-[#2F6FF2]"
                            }`}
                          >
                            <item.icon
                              aria-hidden="true"
                              className={`h-[15px] w-[15px] shrink-0 ${active && item.title === "Dashboard" ? "fill-current" : ""}`}
                              strokeWidth={active ? 2.2 : 2}
                            />
                            <span>{item.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}

              <button
                type="button"
                onClick={() => setLogoutModalOpen(true)}
                className="mt-[5px] flex h-[30px] w-full items-center gap-[9px] border-y border-transparent px-[13px] text-left text-[0.75rem] font-normal uppercase leading-none text-[#ED3237] transition-colors hover:bg-red-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ED3237]"
              >
                <LogOut aria-hidden="true" className="h-[15px] w-[15px] shrink-0" strokeWidth={2.2} />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </SidebarContent>
      </Sidebar>

      {logoutModalOpen && (
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
}
