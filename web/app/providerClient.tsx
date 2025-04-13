"use client";

import React, { useEffect, useState } from "react";

import { AuthProvider } from "@/lib/AuthContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { AppProgressBar } from "@/lib/n-progress";
import { ICurrentUser } from "@/types/auth";

interface IProps {
  children: React.ReactNode;
  currentUser: ICurrentUser | null;
}

export default function providerClient({ children, currentUser }: IProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent rendering until mounted

  return (
    <>
      <AppProgressBar height="4px" color="#3F76FF" options={{ showSpinner: false }} shallowRouting />
      <HeroUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <ToastProvider placement="top-center" toastOffset={60} />
          <AuthProvider initialUser={currentUser}>{children}</AuthProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </>
  );
}
