"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.loading && !state.user) {
      router.replace("/login");
    }
  }, [state.loading, state.user, router]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!state.user) {
    return null; // Prevent flicker before redirect
  }

  return <>{children}</>;
}

