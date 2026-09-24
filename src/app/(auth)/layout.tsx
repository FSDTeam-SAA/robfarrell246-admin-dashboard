import Image from "next/image";
import React from "react";

import authBackground from "../../../public/assets/images/auth_bg.png";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef7ff]">
      <Image
        src={authBackground}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-white/70" aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
