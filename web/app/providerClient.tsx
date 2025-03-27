"use client";

import React from "react";

import { AuthProvider } from "@/lib/AuthContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { AppProgressBar } from "@/lib/n-progress";
import { ICurrentUser } from "@/types/auth";

interface IProps {
  children: React.ReactNode;
  currentUser?: ICurrentUser;
}

export default function providerClient({ children, currentUser }: IProps) {
  return (
    <>
      <AppProgressBar height="4px" color="#3F76FF" options={{ showSpinner: false }} shallowRouting />
      <HeroUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <ToastProvider />
          <AuthProvider initialUser={currentUser}>{children}</AuthProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </>
  );
}
