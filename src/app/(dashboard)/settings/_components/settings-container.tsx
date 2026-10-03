
"use client";

import { Check, ImagePlus, Upload } from "lucide-react";
import { ChangeEvent, useState } from "react";
import ChangePasswordModal from "./change-password-modal";

type SettingsTab = "profile" | "security" | "notifications";

const SettingsContainer = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [logoName, setLogoName] = useState("");
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ analysis: true, credit: true, billing: true });

  const handleLogo = (event: ChangeEvent<HTMLInputElement>) => {
    setLogoName(event.target.files?.[0]?.name ?? "");
    setSaved(false);
  };

  const saveProfile = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  return (
    <section className="bg-[#F7F9FC] p-4 sm:p-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-4">
          <h2 className="text-[19px] font-semibold text-[#172033]">Account &amp; Platform Settings</h2>
          <p className="mt-1 text-[12px] text-[#5D6B82]">Configure profile metadata, security authentication, and automated notifications.</p>
        </div>

        <nav className="mb-5 inline-flex max-w-full overflow-x-auto bg-white p-1" aria-label="Settings sections">
          <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")}>Profile Information</TabButton>
          <TabButton active={activeTab === "security"} onClick={() => setActiveTab("security")}>Security &amp; Sessions</TabButton>
          <TabButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")}>Notification Preferences</TabButton>
        </nav>

        {activeTab === "profile" && <ProfilePanel logoName={logoName} onLogo={handleLogo} onSave={saveProfile} saved={saved} />}
        {activeTab === "security" && <SecurityPanel onChangePassword={() => setPasswordModalOpen(true)} />}
        {activeTab === "notifications" && <NotificationPanel values={notifications} onChange={setNotifications} />}
      </div>
      <ChangePasswordModal isOpen={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} onSave={() => setPasswordModalOpen(false)} />
    </section>
  );
};

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => <button type="button" onClick={onClick} className={`h-[32px] shrink-0 px-6 text-[12px] transition ${active ? "rounded-[3px] bg-[#2861E7] text-white shadow-sm" : "text-[#44556D] hover:text-[#2861E7]"}`}>{children}</button>;

const SettingsCard = ({ title, children }: { title: string; children: React.ReactNode }) => <section className="overflow-hidden rounded-[9px] border border-[#D2DCE8] bg-white"><header className="border-b border-[#DCE3EC] px-4 py-3"><h3 className="text-[16px] font-semibold text-[#172033]">{title}</h3></header>{children}</section>;

const ProfilePanel = ({ logoName, onLogo, onSave, saved }: { logoName: string; onLogo: (event: ChangeEvent<HTMLInputElement>) => void; onSave: () => void; saved: boolean }) => <SettingsCard title="Personal & Company Profile"><div className="p-3.5 sm:p-4"><div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2"><ProfileField label="FULL NAME" placeholder="E.G. ALEX MORGAN" /><ProfileField label="WORK EMAIL" placeholder="alex@firm.com" type="email" /><ProfileField label="Company / Brokerage" placeholder="Austin Retail Commercial Partners" /><ProfileField label="Phone Number" placeholder="(512) 849-2201" type="tel" /></div><label className="mt-3 block text-[12px] text-[#26364D]"><span className="mb-1.5 block">Brokerage / Company Logo</span><span className="flex min-h-[49px] items-center justify-between gap-3 rounded-[3px] border border-[#9DACBF] px-3"><span className="flex min-w-0 items-center gap-2"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-[#E3EBF5] text-[#5C6E86]"><ImagePlus className="h-4 w-4" /></span><span className="min-w-0"><span className="block truncate text-[11px] text-[#5D6B82]">{logoName || "No Custom Company Logo"}</span><span className="block truncate text-[9px] text-[#91A0B5]">{logoName ? "Logo selected and ready to save." : "Currently using default VisionItForMe branding and brokerage initials fallback."}</span></span></span><span className="relative inline-flex h-[25px] shrink-0 items-center gap-1.5 bg-[#DCE9FF] px-3 text-[10px] text-[#344054]"> <Upload className="h-3 w-3" />Upload Logo<input type="file" accept="image/*" onChange={onLogo} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Upload company logo" /></span></span></label><div className="mt-3 flex items-center justify-end gap-3"><span className={`text-[11px] text-[#00A550] transition ${saved ? "opacity-100" : "opacity-0"}`}>Profile changes saved</span><button type="button" onClick={onSave} className="h-[40px] bg-[#2861E7] px-6 text-[12px] font-medium text-white hover:bg-[#1F53CC]">Save Profile Changes</button></div></div></SettingsCard>;

const ProfileField = ({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) => <label className="block text-[12px] font-medium text-[#26364D]"><span className="mb-1.5 block">{label}</span><input type={type} placeholder={placeholder} className="form-input h-[38px] uppercase:placeholder:text-[#8293AD]" /></label>;

const SecurityPanel = ({ onChangePassword }: { onChangePassword: () => void }) => <div className="space-y-4"><SettingsCard title="Password & Authentication"><div className="p-3.5"><div className="flex min-h-[59px] items-center justify-between gap-4 bg-[#F0F4F9] px-3"><span><span className="block text-[14px] font-medium text-[#4C5E78]">Account Password</span><span className="mt-1 block text-[12px] text-[#91A6C3]">Last changed 2 months ago</span></span><button type="button" onClick={onChangePassword} className="h-[34px] shrink-0 bg-[#DBE9FF] px-4 text-[12px] text-[#42546D] hover:bg-[#CCDDFA]">Change Password</button></div></div></SettingsCard><SettingsCard title="Password & Authentication"><div className="space-y-3 p-3.5"><SessionRow /><SessionRow /></div></SettingsCard></div>;

const SessionRow = () => <div className="flex min-h-[59px] items-center justify-between gap-4 bg-[#F0F4F9] px-3"><span><span className="block text-[14px] font-medium text-[#4C5E78]">Chrome on macOS (Austin, TX)</span><span className="mt-1 block text-[12px] text-[#00A550]">Active Current Session</span></span><span className="text-[12px] text-[#7F91AC]">IP: 172.56.21.99</span></div>;

const NotificationPanel = ({ values, onChange }: { values: { analysis: boolean; credit: boolean; billing: boolean }; onChange: (values: { analysis: boolean; credit: boolean; billing: boolean }) => void }) => <SettingsCard title="Email & In-App Notification Alerts"><div className="space-y-3 p-3.5"><NotificationRow title="Analysis Completed" description="Receive instant email alerts when AI market calculations finish." checked={values.analysis} onChange={(checked) => onChange({ ...values, analysis: checked })} /><NotificationRow title="Low Credit Warning" description="Alert when balance falls below 10 credits." checked={values.credit} onChange={(checked) => onChange({ ...values, credit: checked })} /><NotificationRow title="Monthly Billing Invoices" description="Automated receipt attachment emailed upon renewal." checked={values.billing} onChange={(checked) => onChange({ ...values, billing: checked })} /></div></SettingsCard>;

const NotificationRow = ({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) => <label className="flex min-h-[59px] cursor-pointer items-center justify-between gap-4 bg-[#F0F4F9] px-3"><span><span className="block text-[14px] font-medium text-[#4C5E78]">{title}</span><span className="mt-1 block text-[12px] text-[#91A6C3]">{description}</span></span><span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${checked ? "border-[#00B45A] bg-[#EAFBF1] text-[#00A550]" : "border-[#94A3B8] bg-white text-transparent"}`}><Check className="h-3 w-3" /><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="sr-only" /></span></label>;

export default SettingsContainer;
