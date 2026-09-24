import { Suspense } from "react";
import ResetPasswordForm from "./_components/reset-password-form";

const ResetPasswordPage = () => (
  <Suspense fallback={<div className="text-sm text-[#344054]">Loading...</div>}>
    <ResetPasswordForm />
  </Suspense>
);

export default ResetPasswordPage;
