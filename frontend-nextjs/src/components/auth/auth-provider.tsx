"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useHydration } from "@/hooks/use-hydration";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const isHydrated = useHydration();

  useEffect(() => {
    // Only run auth check after hydration
    if (isHydrated && typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const protectedRoutes = [
        "/dashboard",
        "/import",
        "/payroll",
        "/employees",
        "/profile",
        "/my-payroll",
      ];

      const isProtectedRoute = protectedRoutes.some((route) =>
        currentPath.startsWith(route)
      );

      if (isProtectedRoute && !isAuthenticated) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isHydrated, router]);

  // During SSR and initial hydration, render children immediately
  // This prevents hydration mismatch
  if (!isHydrated) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
