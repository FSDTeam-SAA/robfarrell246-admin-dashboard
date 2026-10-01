import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, ArrowRight, CircleX } from "lucide-react";

type SuspendUserModalProps = {
  isOpen: boolean;
  userName: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

const SuspendUserModal = ({
  isOpen,
  userName,
  onClose,
  onConfirm,
}: SuspendUserModalProps) => (
  <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DialogContent
      overlayClassName="bg-[#526174]/35 backdrop-blur-[3px]"
      className="w-[calc(100%-2rem)] max-w-[536px] gap-0 overflow-hidden rounded-[3px] border-0 bg-white p-0 shadow-[0_14px_42px_rgba(26,39,61,0.18)]"
    >
      <DialogHeader className="border-b border-[#EDF0F4] px-6 py-5 text-left">
        <DialogTitle className="flex items-center gap-3 text-[18px] font-semibold text-[#182238]">
          <span className="relative flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden="true">
            <AlertTriangle className="h-5 w-5 fill-[#E5262A] text-[#E5262A]" strokeWidth={2} />
            <span className="absolute -mt-px text-[11px] font-bold leading-none text-white">!</span>
          </span>
          Suspend User Account
        </DialogTitle>
      </DialogHeader>

      <div className="flex min-h-[205px] flex-col items-center justify-center px-6 py-8 text-center">
        <span className="relative mb-12 flex h-12 w-12 shrink-0 items-center justify-center" aria-hidden="true">
          <AlertTriangle className="h-12 w-12 fill-[#E5262A] text-[#E5262A]" strokeWidth={1.8} />
          <span className="absolute -mt-px text-[29px] font-bold leading-none text-white">!</span>
        </span>
        <DialogDescription className="text-[14px] leading-5 text-[#6A7C9B]">
          Are you sure you want to suspend access for {userName}?
        </DialogDescription>
      </div>

      <DialogFooter className="!grid grid-cols-2 gap-3 border-t border-[#EDF0F4] bg-white px-5 py-4 sm:space-x-0">
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 items-center justify-center gap-2 rounded-[2px] bg-[#F5F7FA] px-4 text-[14px] font-medium text-[#5F7290] transition hover:bg-[#EDF1F6]"
        >
          <CircleX className="h-4 w-4" strokeWidth={1.7} />
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-11 items-center justify-center gap-2 rounded-[2px] bg-[#E5262A] px-4 text-[14px] font-medium text-white transition hover:bg-[#C91D22]"
        >
          Suspend Account
          <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default SuspendUserModal;
