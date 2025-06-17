"use client";

import { useClientOnly } from "@/hooks/use-hydration";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component to prevent hydration mismatch for client-only content
 * Renders fallback during SSR, actual content after hydration
 */
export default function ClientOnly({
  children,
  fallback = null,
}: ClientOnlyProps) {
  const isClient = useClientOnly();

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
