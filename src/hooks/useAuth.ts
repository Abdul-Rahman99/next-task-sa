import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "./store";

export function useAuth(requireAdmin = false) {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (requireAdmin && user?.role !== "admin") {
      router.push("/");
    }
  }, [user, router, requireAdmin]);

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === "admin",
  };
}
