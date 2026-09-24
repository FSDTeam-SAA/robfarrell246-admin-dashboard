
"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { UserProfileApiResponse } from "./user-data-type";
import ProfilePicture from "./profile-picture";
import { SettingSidebarSkeleton } from "./setting-sidebar-skeleton";

const SettingSidebar = () => {
  const session = useSession();
  const status = session?.status;
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading } = useQuery<UserProfileApiResponse>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      return await res.json();
    },
    enabled: !!token
  })

  const fullName =
    data?.data?.fullName ||
    [data?.data?.firstName, data?.data?.lastName].filter(Boolean).join(" ") ||
    "N/A";

  if (status === "loading" || isLoading) {
    return <SettingSidebarSkeleton />;
  }


  return (
    <aside className="h-full min-h-[553px] overflow-hidden rounded-[5px] bg-[#F5F6F7] shadow-[0_2px_7px_rgba(24,30,43,0.16)]">
      <div className="h-[132px] bg-gradient-to-b from-[#303956] via-[#6879C9] to-[#D9C9FF]" />
      <ProfilePicture />

      <div className="px-4 pb-6">
        <div className="pb-6 pt-5 text-center">
          <h2 className="text-lg font-semibold leading-tight text-[#000044]">{fullName}</h2>
          <p className="mt-1 text-[11px] text-[#000044]">{data?.data?.email || "N/A"}</p>
        </div>

        <dl className="space-y-3 text-[11px] leading-[17px] text-[#07123F]">
          <div><dt className="inline font-medium text-[#313640]">Name: </dt><dd className="inline">{fullName}</dd></div>
          <div><dt className="inline font-medium text-[#313640]">Bio: </dt><dd className="inline">{data?.data?.bio || "N/A"}</dd></div>
          <div><dt className="inline font-medium text-[#313640]">Email: </dt><dd className="inline break-all">{data?.data?.email || "N/A"}</dd></div>
          <div><dt className="inline font-medium text-[#313640]">Phone: </dt><dd className="inline">{data?.data?.phoneNumber || "N/A"}</dd></div>
          <div><dt className="inline font-medium text-[#313640]">Location: </dt><dd className="inline">{data?.data?.address || "N/A"}</dd></div>
        </dl>
      </div>
    </aside>
  );
};

export default SettingSidebar
