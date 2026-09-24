"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string()
    .min(8, "Password must contain at least 8 characters.")
    .regex(/[A-Z]/, "Add at least one uppercase letter.")
    .regex(/[a-z]/, "Add at least one lowercase letter.")
    .regex(/[0-9]/, "Add at least one number.")
    .regex(/[^A-Za-z0-9\s]/, "Add at least one special character.")
    .regex(/^\S*$/, "Spaces are not allowed."),
  confirmPassword: z.string().min(1, "Please confirm your new password."),
}).refine((values) => values.newPassword === values.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match.",
});

type PasswordValues = z.infer<typeof formSchema>;
type PasswordFieldName = "oldPassword" | "newPassword" | "confirmPassword";

const ChangePasswordForm = () => {
  const [visible, setVisible] = useState<Record<PasswordFieldName, boolean>>({ oldPassword: false, newPassword: false, confirmPassword: false });
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;
  const form = useForm<PasswordValues>({ resolver: zodResolver(formSchema), defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" } });
  const newPassword = form.watch("newPassword");

  const { mutate, isPending } = useMutation({
    mutationKey: ["changePassword"],
    mutationFn: async (values: Pick<PasswordValues, "oldPassword" | "newPassword">) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      });
      return response.json();
    },
    onSuccess: (response) => {
      if (!response?.success) return toast.error(response?.message || "Something went wrong");
      toast.success(response?.message || "Password changed successfully!");
      form.reset();
    },
    onError: () => toast.error("Password update failed"),
  });

  const rules = [
    { label: "Minimum 8–12 characters (recommend 12+ for stronger security).", valid: newPassword.length >= 8 },
    { label: "At least one uppercase letter must.", valid: /[A-Z]/.test(newPassword) },
    { label: "At least one lowercase letter must.", valid: /[a-z]/.test(newPassword) },
    { label: "At least one number must (0–9).", valid: /[0-9]/.test(newPassword) },
    { label: "At least special character (! @ # $ % ^ & * etc.).", valid: /[^A-Za-z0-9\s]/.test(newPassword) },
    { label: "No spaces allowed.", valid: newPassword.length > 0 && /^\S*$/.test(newPassword) },
  ];

  const submit = (values: PasswordValues) => mutate({ oldPassword: values.oldPassword, newPassword: values.newPassword });

  return (
    <section className="min-h-[553px] rounded-[5px] bg-[#F5F6F7] px-4 py-5 shadow-[0_2px_7px_rgba(24,30,43,0.10)] sm:px-11">
      <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#000044]">Changes Password</h1>
      <p className="mt-1 text-xs text-[#6E7379]">Manage your account preferences, security settings, and privacy options.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="mt-8 flex min-h-[410px] flex-col">
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <PasswordField form={form} name="oldPassword" label="Current Password" show={visible.oldPassword} toggle={() => setVisible((current) => ({ ...current, oldPassword: !current.oldPassword }))} />
            <PasswordField form={form} name="newPassword" label="New Password" show={visible.newPassword} toggle={() => setVisible((current) => ({ ...current, newPassword: !current.newPassword }))} />
            <PasswordField form={form} name="confirmPassword" label="Confirm New Password" show={visible.confirmPassword} toggle={() => setVisible((current) => ({ ...current, confirmPassword: !current.confirmPassword }))} />
          </div>

          <ul className="mt-4 space-y-2">
            {rules.map((rule) => (
              <li key={rule.label} className={`flex items-center gap-2 text-[10px] ${rule.valid ? "text-[#07123F]" : "text-[#FF2945]"}`}>
                {rule.valid ? <Check className="size-4 stroke-[1.8]" /> : <X className="size-4 stroke-[1.8]" />}
                {rule.label}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col-reverse gap-3 pt-7 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => form.reset()} className="h-9 rounded-[4px] border-[#FF4D61] bg-transparent px-5 text-[11px] font-normal text-[#FF334C] shadow-none hover:bg-[#FFF1F3] hover:text-[#E7263E]">Discard Changes</Button>
            <Button type="submit" disabled={isPending} className="h-9 rounded-[4px] bg-[#000044] px-7 text-[11px] font-normal text-white shadow-none hover:bg-[#000033]">{isPending ? "Saving..." : "Save Changes"}</Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

const PasswordField = ({ form, name, label, show, toggle }: { form: ReturnType<typeof useForm<PasswordValues>>; name: PasswordFieldName; label: string; show: boolean; toggle: () => void }) => (
  <FormField control={form.control} name={name} render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel className="text-xs font-medium text-[#444950]">{label}</FormLabel>
      <div className="relative">
        <FormControl><Input {...field} type={show ? "text" : "password"} placeholder="********" className={`h-9 rounded-[3px] bg-transparent px-2.5 pr-10 text-xs text-[#71757B] shadow-none focus-visible:ring-[#000044] ${fieldState.error ? "border-[#FF4960]" : "border-[#C8CBCF]"}`} /></FormControl>
        <button type="button" aria-label={show ? `Hide ${label}` : `Show ${label}`} onClick={toggle} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#737A7B] hover:bg-[#E9EBED]">
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      <FormMessage className="text-[10px]" />
    </FormItem>
  )} />
);

export default ChangePasswordForm;
