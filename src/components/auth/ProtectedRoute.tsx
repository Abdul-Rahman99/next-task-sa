"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, access_token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!access_token) {
      router.push("/login");
      return;
    }

    if (requireAdmin && user?.role !== "admin") {
      router.push("/");
    }
  }, [access_token, user, router, requireAdmin]);

  if (!access_token || (requireAdmin && user?.role !== "admin")) {
    return null;
  }

  return <>{children}</>;
}
