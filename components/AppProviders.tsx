"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function AppProviders({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(18, 20, 18, 0.92)",
            color: "#f8faf7",
            backdropFilter: "blur(16px)",
          },
        }}
      />
    </>
  );
}
