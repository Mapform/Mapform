"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect, use } from "react";
import type { GetUser } from "@mapform/backend/data/users/get-user";
import type { GetCurrentSession } from "~/data/auth/get-current-session";

interface AuthContextType {
  user: GetUser | null;
  setUser: (user: GetUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export function AuthProvider({
  children,
  currentSessionPromise,
}: {
  children: ReactNode;
  currentSessionPromise: GetCurrentSession;
}) {
  const session = use(currentSessionPromise);
  const [user, setUser] = useState<GetUser | null>(session?.user ?? null);

  useEffect(() => {
    setUser(session?.user ?? null);
  }, [session?.user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
