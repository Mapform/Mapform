"use client";

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  use,
  Suspense,
} from "react";
import type { GetCurrentSession } from "~/data/auth/get-current-session";
import { TooltipProvider } from "@mapform/ui/components/tooltip";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ParamsProvider } from "~/lib/params/client";

type User = NonNullable<
  NonNullable<Awaited<GetCurrentSession>>["data"]
>["user"];

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  }

  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export function RootProviders({
  children,
  currentSessionPromise,
}: {
  children: React.ReactNode;
  currentSessionPromise: GetCurrentSession;
}) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const session = use(currentSessionPromise);
  const [user, setUser] = useState<User | null>(session?.data?.user ?? null);

  useEffect(() => {
    setUser(session?.data?.user ?? null);
  }, [session?.data?.user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          enableSystem
        >
          <Suspense>
            <NuqsAdapter>
              <ParamsProvider>
                <TooltipProvider delayDuration={200}>
                  {children}
                </TooltipProvider>
              </ParamsProvider>
            </NuqsAdapter>
          </Suspense>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}
