import { Suspense } from "react";
import OtpForm from "./_components/otp-form";

const OtpPage = () => (
  <Suspense fallback={<div className="text-sm text-[#344054]">Loading...</div>}>
    <OtpForm />
  </Suspense>
);

export default OtpPage;
