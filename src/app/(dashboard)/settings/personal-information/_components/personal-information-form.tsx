"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PersonalInfoSkeleton from "../../_components/personal-info-skeleton";
import { UserProfileApiResponse } from "../../_components/user-data-type";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phoneNumber: z.string().min(2, "Please enter a phone number."),
  gender: z.enum(["male", "female"]),
  bio: z.string().optional(),
  address: z.string().min(2, "Please enter a street address."),
  city: z.string().min(2, "Please enter a location."),
  postcode: z.string().min(2, "Please enter a postal code."),
});

type ProfileValues = z.infer<typeof formSchema>;

const fieldClassName = "h-9 rounded-[3px] border-[#C8CBCF] bg-transparent px-2.5 text-xs text-[#71757B] shadow-none placeholder:text-[#8D9298] focus-visible:ring-[#000044]";

const PersonalInformationForm = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;

  const { data, isLoading } = useQuery<UserProfileApiResponse>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  const form = useForm<ProfileValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phoneNumber: "", gender: "male", bio: "", address: "", city: "", postcode: "" },
  });

  useEffect(() => {
    const user = data?.data;
    if (!user) return;
    const nameParts = (user.fullName || "").trim().split(/\s+/);
    form.reset({
      firstName: user.firstName || nameParts[0] || "",
      lastName: user.lastName || nameParts.slice(1).join(" ") || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || user.phone || "",
      gender: user.gender || "male",
      bio: user.bio || "",
      address: user.address || "",
      city: user.city || "",
      postcode: user.postcode || "",
    });
  }, [data?.data, form]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (values: ProfileValues) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...values, fullName: `${values.firstName} ${values.lastName}`.trim() }),
      });
      return response.json();
    },
    onSuccess: async (response) => {
      if (!response?.success) return toast.error(response?.message || "Something went wrong");
      toast.success(response?.message || "Profile updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: () => toast.error("Update failed"),
  });

  if (isLoading) return <PersonalInfoSkeleton />;

  return (
    <section className="min-h-[610px] rounded-[5px] bg-[#F5F6F7] px-4 py-5 shadow-[0_2px_7px_rgba(24,30,43,0.10)] sm:px-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#000044]">Personal Information</h1>
        <p className="mt-1 text-xs text-[#6E7379]">Manage your personal information and profile details.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => mutate(values))} className="mt-7 flex min-h-[490px] flex-col">
          <FormField control={form.control} name="gender" render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-4">
                  {(["male", "female"] as const).map((gender) => (
                    <label key={gender} className="inline-flex cursor-pointer items-center gap-2 text-xs capitalize text-[#3F444B]">
                      <input type="radio" value={gender} checked={field.value === gender} onChange={() => field.onChange(gender)} className="size-3.5 accent-[#000044]" />
                      {gender}
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="mt-7 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <ProfileField control={form.control} name="firstName" label="First Name" placeholder="Welly" />
            <ProfileField control={form.control} name="lastName" label="Last Name" placeholder="Wilson" />
            <ProfileField control={form.control} name="email" label="Email Address" placeholder="example@example.com" type="email" />
            <ProfileField control={form.control} name="phoneNumber" label="Phone Number" placeholder="+1 (555) 123-4567" />

            <FormField control={form.control} name="bio" render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="text-xs font-medium text-[#444950]">Bio</FormLabel>
                <FormControl><Textarea {...field} className="min-h-[72px] resize-none rounded-[3px] border-[#C8CBCF] bg-transparent px-2.5 py-2 text-xs text-[#71757B] shadow-none focus-visible:ring-[#000044]" placeholder="Write a short bio" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="sm:col-span-2"><ProfileField control={form.control} name="address" label="Street Address" placeholder="1234 Oak Avenue, San Francisco, CA 94102A" /></div>
            <ProfileField control={form.control} name="city" label="Location" placeholder="Florida, USA" />
            <ProfileField control={form.control} name="postcode" label="Postal Code" placeholder="30301" />
          </div>

          <div className="mt-auto flex flex-col-reverse gap-3 pt-7 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => form.reset()} className="h-9 rounded-[4px] border-[#FF4D61] bg-transparent px-5 text-[11px] font-normal text-[#FF334C] shadow-none hover:bg-[#FFF1F3] hover:text-[#E7263E]">Discard Changes</Button>
            <Button type="submit" disabled={isPending} className="h-9 rounded-[4px] bg-[#000044] px-7 text-[11px] font-normal text-white shadow-none hover:bg-[#000033]">{isPending ? "Saving..." : "Save Changes"}</Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

type FieldName = "firstName" | "lastName" | "email" | "phoneNumber" | "address" | "city" | "postcode";

const ProfileField = ({ control, name, label, placeholder, type = "text" }: { control: ReturnType<typeof useForm<ProfileValues>>["control"]; name: FieldName; label: string; placeholder: string; type?: string }) => (
  <FormField control={control} name={name} render={({ field }) => (
    <FormItem>
      <FormLabel className="text-xs font-medium text-[#444950]">{label}</FormLabel>
      <FormControl><Input {...field} type={type} className={fieldClassName} placeholder={placeholder} /></FormControl>
      <FormMessage />
    </FormItem>
  )} />
);

export default PersonalInformationForm;
