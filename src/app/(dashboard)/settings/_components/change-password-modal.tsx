"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { KeyRound, X } from "lucide-react";
import { useState } from "react";

type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
};

const ChangePasswordModal = ({ isOpen, onClose, onSave }: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const close = () => {
    setError("");
    onClose();
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentPassword || newPassword.length < 8) {
      setError("Enter your current password and a new password of at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation must match.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onSave();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent overlayClassName="bg-[#526174]/35 backdrop-blur-[3px]" className="w-[calc(100%-2rem)] max-w-[470px] gap-0 overflow-hidden rounded-[4px] border-0 bg-white p-0 shadow-[0_14px_42px_rgba(26,39,61,0.18)]">
        <button type="button" onClick={close} className="absolute right-4 top-4 z-10 text-[#7B8798] hover:text-[#344054]" aria-label="Close password dialog"><X className="h-4 w-4" /></button>
        <DialogHeader className="border-b border-[#E3E8EF] px-5 py-4 text-left">
          <DialogTitle className="flex items-center gap-2 text-[16px] font-semibold text-[#182238]"><KeyRound className="h-4 w-4 text-[#2861E7]" />Change Password</DialogTitle>
          <DialogDescription className="mt-1 text-[11px] text-[#7E8EA5]">Use a strong password you do not use elsewhere.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="px-5 py-4">
          <PasswordField label="Current Password" value={currentPassword} onChange={setCurrentPassword} />
          <div className="mt-3"><PasswordField label="New Password" value={newPassword} onChange={setNewPassword} /></div>
          <div className="mt-3"><PasswordField label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} /></div>
          {error && <p className="mt-3 text-[11px] text-[#D92D20]" role="alert">{error}</p>}
          <footer className="mt-5 grid grid-cols-2 gap-3"><button type="button" onClick={close} className="h-[35px] bg-[#F1F4F8] text-[12px] text-[#53647C] hover:bg-[#E7ECF2]">Cancel</button><button type="submit" className="h-[35px] bg-[#2861E7] text-[12px] font-medium text-white hover:bg-[#1F53CC]">Update Password</button></footer>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const PasswordField = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => <label className="block text-[11px] font-medium text-[#344054]"><span className="mb-1.5 block">{label}</span><input required type="password" value={value} onChange={(event) => onChange(event.target.value)} className="form-input" autoComplete="new-password" /></label>;

export default ChangePasswordModal;
