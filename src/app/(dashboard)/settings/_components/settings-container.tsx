"use client";

import { Check, ImagePlus, Upload } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ApiEmptyState,
  ApiErrorState,
  ApiLoadingSkeleton,
} from "../../_components/api-feedback";
import ChangePasswordModal from "./change-password-modal";
import {
  type Profile,
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
} from "./settings-api";

type SettingsTab = "profile" | "security" | "notifications";

const SettingsContainer = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    analysis: true,
    credit: true,
    billing: true,
  });
  const profileQuery = useProfile();

  return (
    <section className="bg-[#F7F9FC] p-4 sm:p-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-4">
          <h2 className="text-[19px] font-semibold text-[#172033]">
            Account &amp; Platform Settings
          </h2>
          <p className="mt-1 text-[12px] text-[#5D6B82]">
            Configure profile metadata, security authentication, and automated
            notifications.
          </p>
        </div>
        <nav
          className="mb-5 inline-flex max-w-full overflow-x-auto bg-white p-1"
          aria-label="Settings sections"
        >
          <TabButton
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </TabButton>
          <TabButton
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
          >
            Security &amp; Sessions
          </TabButton>
          {/* <TabButton
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          >
            Notification Preferences
          </TabButton> */}
        </nav>
        {profileQuery.isLoading ? (
          <ApiLoadingSkeleton rows={4} />
        ) : profileQuery.isError ? (
          <ApiErrorState
            message={profileQuery.error.message}
            onRetry={() => profileQuery.refetch()}
          />
        ) : !profileQuery.data ? (
          <ApiEmptyState message="Profile not found." />
        ) : (
          <>
            {activeTab === "profile" && (
              <ProfilePanel profile={profileQuery.data} />
            )}
            {activeTab === "security" && (
              <SecurityPanel
                onChangePassword={() => setPasswordModalOpen(true)}
              />
            )}
            {activeTab === "notifications" && (
              <NotificationPanel
                values={notifications}
                onChange={setNotifications}
              />
            )}
          </>
        )}
      </div>
      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSave={() => setPasswordModalOpen(false)}
      />
    </section>
  );
};

const TabButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-[32px] shrink-0 px-6 text-[12px] transition ${active ? "rounded-[3px] bg-[#2861E7] text-white shadow-sm" : "text-[#44556D] hover:text-[#2861E7]"}`}
  >
    {children}
  </button>
);
const SettingsCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="overflow-hidden rounded-[9px] border border-[#D2DCE8] bg-white">
    <header className="border-b border-[#DCE3EC] px-4 py-3">
      <h3 className="text-[16px] font-semibold text-[#172033]">{title}</h3>
    </header>
    {children}
  </section>
);

const ProfilePanel = ({ profile }: { profile: Profile }) => {
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const [values, setValues] = useState({
    name: profile.name || "",
    companyName: profile.companyName || "",
    phone: profile.phone || "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(
    () =>
      setValues({
        name: profile.name || "",
        companyName: profile.companyName || "",
        phone: profile.phone || "",
      }),
    [profile],
  );
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const selectAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setAvatar(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };
  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateProfile.mutateAsync(values);
      if (avatar)
        await uploadAvatar.mutateAsync({
          file: avatar,
          hasAvatar: Boolean(profile.profileImage),
        });
      toast.success("Profile changes saved");
      setAvatar(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save profile",
      );
    }
  };

  const logoPreview = previewUrl || profile.profileImage;

  return (
    <SettingsCard title="Personal & Company Profile">
      <form onSubmit={saveProfile} className="p-3.5 sm:p-4">
        <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          <ProfileField
            label="FULL NAME"
            value={values.name}
            placeholder="Enter your full name"
            onChange={(name) => setValues((current) => ({ ...current, name }))}
          />
          <ProfileField
            label="WORK EMAIL"
            value={profile.email}
            placeholder="Email address"
            type="email"
            disabled
          />
          <ProfileField
            label="Company / Brokerage"
            value={values.companyName}
            placeholder="Enter company or brokerage name"
            onChange={(companyName) =>
              setValues((current) => ({ ...current, companyName }))
            }
          />
          <ProfileField
            label="Phone Number"
            value={values.phone}
            placeholder="Enter phone number"
            type="tel"
            onChange={(phone) =>
              setValues((current) => ({ ...current, phone }))
            }
          />
        </div>
        <label className="mt-3 block text-[12px] text-[#26364D]">
          <span className="mb-1.5 block">Brokerage / Company Logo</span>
          <span className="flex min-h-[49px] items-center justify-between gap-3 rounded-[3px] border border-[#9DACBF] px-3">
            <span className="flex min-w-0 items-center gap-2">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Selected company logo preview"
                  className="h-9 w-9 shrink-0 rounded-[4px] border border-[#D7E0EB] object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-[#E3EBF5] text-[#5C6E86]">
                  <ImagePlus className="h-4 w-4" />
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate text-[11px] text-[#5D6B82]">
                  {avatar?.name ||
                    (profile.profileImage
                      ? "Current company logo"
                      : "No Custom Company Logo")}
                </span>
                <span className="block truncate text-[9px] text-[#91A0B5]">
                  {avatar
                    ? "Image preview selected and ready to save."
                    : profile.profileImage
                      ? "Current logo preview."
                      : "Currently using default VisionItForMe branding and brokerage initials fallback."}
                </span>
              </span>
            </span>
            <span className="relative inline-flex h-[25px] shrink-0 items-center gap-1.5 bg-[#DCE9FF] px-3 text-[10px] text-[#344054]">
              <Upload className="h-3 w-3" />
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={selectAvatar}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Upload company logo"
              />
            </span>
          </span>
        </label>
        <div className="mt-3 flex items-center justify-end gap-3">
          <button
            disabled={updateProfile.isPending || uploadAvatar.isPending}
            type="submit"
            className="h-[40px] bg-[#2861E7] px-6 text-[12px] font-medium text-white hover:bg-[#1F53CC] disabled:opacity-60"
          >
            {updateProfile.isPending || uploadAvatar.isPending
              ? "Saving..."
              : "Save Profile Changes"}
          </button>
        </div>
      </form>
    </SettingsCard>
  );
};

const ProfileField = ({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange?: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) => (
  <label className="block text-[12px] font-medium text-[#26364D]">
    <span className="mb-1.5 block">{label}</span>
    <input
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(event) => onChange?.(event.target.value)}
      type={type}
      className="form-input h-[38px] placeholder:text-[#8293AD] disabled:cursor-not-allowed disabled:bg-[#F0F4F9]"
    />
  </label>
);
const SecurityPanel = ({
  onChangePassword,
}: {
  onChangePassword: () => void;
}) => (
  <div className="space-y-4">
    <SettingsCard title="Password & Authentication">
      <div className="p-3.5">
        <div className="flex min-h-[59px] items-center justify-between gap-4 bg-[#F0F4F9] px-3">
          <span>
            <span className="block text-[14px] font-medium text-[#4C5E78]">
              Account Password
            </span>
            <span className="mt-1 block text-[12px] text-[#91A6C3]">
              Use a strong password you do not use elsewhere.
            </span>
          </span>
          <button
            type="button"
            onClick={onChangePassword}
            className="h-[34px] shrink-0 bg-[#DBE9FF] px-4 text-[12px] text-[#42546D] hover:bg-[#CCDDFA]"
          >
            Change Password
          </button>
        </div>
      </div>
    </SettingsCard>
    <SettingsCard title="Security & Sessions">
      <div className="space-y-3 p-3.5">
        <SessionRow />
      </div>
    </SettingsCard>
  </div>
);
const SessionRow = () => (
  <div className="flex min-h-[59px] items-center justify-between gap-4 bg-[#F0F4F9] px-3">
    <span>
      <span className="block text-[14px] font-medium text-[#4C5E78]">
        Current session
      </span>
      <span className="mt-1 block text-[12px] text-[#00A550]">
        Session management API unavailable
      </span>
    </span>
  </div>
);
const NotificationPanel = ({
  values,
  onChange,
}: {
  values: { analysis: boolean; credit: boolean; billing: boolean };
  onChange: (values: {
    analysis: boolean;
    credit: boolean;
    billing: boolean;
  }) => void;
}) => (
  <SettingsCard title="Email & In-App Notification Alerts">
    <div className="space-y-3 p-3.5">
      <NotificationRow
        title="Analysis Completed"
        description="Preference sync API unavailable."
        checked={values.analysis}
        onChange={(checked) => onChange({ ...values, analysis: checked })}
      />
      <NotificationRow
        title="Low Credit Warning"
        description="Preference sync API unavailable."
        checked={values.credit}
        onChange={(checked) => onChange({ ...values, credit: checked })}
      />
      <NotificationRow
        title="Monthly Billing Invoices"
        description="Preference sync API unavailable."
        checked={values.billing}
        onChange={(checked) => onChange({ ...values, billing: checked })}
      />
    </div>
  </SettingsCard>
);
const NotificationRow = ({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <label className="flex min-h-[59px] cursor-pointer items-center justify-between gap-4 bg-[#F0F4F9] px-3">
    <span>
      <span className="block text-[14px] font-medium text-[#4C5E78]">
        {title}
      </span>
      <span className="mt-1 block text-[12px] text-[#91A6C3]">
        {description}
      </span>
    </span>
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${checked ? "border-[#00B45A] bg-[#EAFBF1] text-[#00A550]" : "border-[#94A3B8] bg-white text-transparent"}`}
    >
      <Check className="h-3 w-3" />
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
    </span>
  </label>
);

export default SettingsContainer;
