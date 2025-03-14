"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }else if (status === "authenticated") {
      if (session?.user?.role === "admin") {
        router.push("/manageuser");
      } else if (session?.user?.role === "employee") {
        router.push("/complaintentry");
      }
    }
  }, [session, status, router]);

  if (status === "loading") return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Complaint Management System</h1>

      {session ? (
        <p className="text-center mt-6 text-lg">Redirecting to your dashboard...</p>
      ) : (
        <p className="text-red-500 text-center">Please log in to access the system.</p>
      )}
    </main>
  );
}
