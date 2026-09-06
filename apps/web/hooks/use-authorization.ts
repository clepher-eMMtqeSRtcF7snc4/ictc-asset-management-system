"use client";

import { createContext, useContext } from "react";
import { trpc } from "@/lib/trpc/client";

export interface UserRole {
  id: string;
  code: string;
  name: string;
}

export interface UserAuthorization {
  userId: string;
  roles: UserRole[];
  permissions: Set<string>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

interface AuthorizationContextType {
  userAuthorization: UserAuthorization | null;
  isLoading: boolean;
  can: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  refetch: () => void;
}

const AuthorizationContext = createContext<AuthorizationContextType | undefined>(undefined);

export function AuthorizationProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, refetch } = trpc.auth.getAuthorization.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const userAuthorization: UserAuthorization | null = data?.data
    ? {
        userId: data.data.userId,
        roles: data.data.roles,
        permissions: new Set(data.data.permissions),
        isSuperAdmin: data.data.isSuperAdmin,
        isAdmin: data.data.isAdmin,
      }
    : null;

  const can = (permission: string): boolean => {
    if (!userAuthorization) return false;
    return userAuthorization.isSuperAdmin || userAuthorization.permissions.has(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!userAuthorization) return false;
    if (userAuthorization.isSuperAdmin) return true;
    return permissions.some((p) => userAuthorization.permissions.has(p));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!userAuthorization) return false;
    if (userAuthorization.isSuperAdmin) return true;
    return permissions.every((p) => userAuthorization.permissions.has(p));
  };

  const contextValue: AuthorizationContextType = {
    userAuthorization,
    isLoading,
    can,
    hasAnyPermission,
    hasAllPermissions,
    refetch,
  };

  return (
    <AuthorizationContext.Provider value={contextValue}>
      {children}
    </AuthorizationContext.Provider>
  );
}

export function useAuthorization() {
  const context = useContext(AuthorizationContext);
  if (!context) {
    throw new Error("useAuthorization must be used within AuthorizationProvider");
  }
  return context;
}
