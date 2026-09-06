"use client"
import { queryClient, trpc, trpcClient } from "@/lib/trpc/client"
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthorizationProvider } from "@/hooks/use-authorization";

import { PropsWithChildren } from "react";

export default function TrpcProvider({ children }: PropsWithChildren){
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthorizationProvider>
          {children}
        </AuthorizationProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}