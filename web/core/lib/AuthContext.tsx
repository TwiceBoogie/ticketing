"use client";

import { ICurrentUser } from "@/types/auth";
import { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: ICurrentUser | null;
  setUser: (user: ICurrentUser | null) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: ICurrentUser | null;
}) {
  const [user, setUser] = useState(initialUser || null);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
