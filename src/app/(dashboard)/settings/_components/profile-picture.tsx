"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilLine } from "lucide-react";
import { useSession } from "next-auth/react";
import Image, { type StaticImageData } from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UserProfileApiResponse } from "./user-data-type";

import NoUserImage from "../../../../../public/assets/images/no-user.jpeg"


const ProfilePicture = () => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const queryClient = useQueryClient();

  const [profilePicture, setProfilePicture] = useState<string | StaticImageData>(NoUserImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // get api
  const { data } = useQuery<UserProfileApiResponse>({
    queryKey: ["user-profile"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
      enabled: !!token
  });

  // update api
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-profile-image"],
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: async (data) => {
      toast.success(data?.message || "Profile image updated successfully!");
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      toast.error("Upload failed");
      console.error(error);
    },
  });

  useEffect(() => {
    const image = data?.data?.profilePicture;
    if (image) {
      setProfilePicture(image);
    }
  }, [data?.data?.profilePicture]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file to backend
    const formData = new FormData();
    formData.append("profilePicture", file, file.name);
    mutate(formData);
  };

  return (
    <div className="relative -mt-[67px] flex justify-center">
      <div className="relative rounded-full border-[3px] border-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
        <div className="relative size-[112px] overflow-hidden rounded-full bg-white">
          <Image
            src={profilePicture}
            alt="Profile"
            width={112}
            height={112}
            className="size-full object-cover"
          />
        </div>

        <div className="absolute -bottom-1 -right-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          <Button
            type="button"
            size="sm"
            className="size-7 rounded-full border-2 border-white bg-[#6C5CE7] p-0 text-white shadow-md hover:bg-[#5848D4]"
            title="Upload new image"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
          >
            <PencilLine className="!size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicture;
