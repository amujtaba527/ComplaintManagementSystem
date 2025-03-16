'use client';

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const {status,data: session } = useSession();

  if (status === "loading") return <p className="text-center mt-10">Loading...</p>;

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0">
          <Image
            src="/images/banner.jpg"
            alt="Background"
            fill
            className="object-cover h-full w-full"
            priority
          />
          <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
        </div>
        <main className="relative z-10 max-w-4xl mx-auto p-6">
          <h1 className="text-4xl font-bold mb-4 text-center text-white">
            Complaint Management System
          </h1>
          <p className="text-xl text-center text-white">
            Please <Link href="/login" className="text-blue-300 hover:text-blue-400 underline">log in</Link> to access the system.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        <Image
          src = "/images/banner.jpg"
          alt="Background"
          fill
          className="object-cover h-full w-full"
          priority
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay */}
      </div>

    <main className="relative z-10 max-w-4xl mx-auto p-6">
      <div className="bg-white-50 rounded-lg shadow-xl p-8 backdrop-blur-sm">
        <h1 className="text-3xl font-bold mb-4 text-center text-black">
          Welcome to Complaint Management System
        </h1>

        <div className="mt-8 text-center">
          <p className="mb-6 text-xl text-gray-900">
            Welcome back, {session?.user?.name || 'User'}!
          </p>

        </div>
      </div>
    </main>
  </div>
  );
}
