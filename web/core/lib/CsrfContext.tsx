"use client";

import { createContext, useContext } from "react";
import { CsrfError } from "@/helpers/errors/CsrfError";

export const CsrfContext = createContext<string | null>(null);

export function useCsrfToken() {
  const token = useContext(CsrfContext);
  if (!token) {
    throw new CsrfError("useCsrfToken must be used within CsrfProvider");
  }
  return token;
}

export function CsrfProviderClient({ token, children }: { token: string; children: React.ReactNode }) {
  return <CsrfContext.Provider value={token}>{children}</CsrfContext.Provider>;
}
