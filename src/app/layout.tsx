"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <div className="min-h-screen bg-gray-100">
          {!isLoginPage && <Navbar />}
          <div className={!isLoginPage ? "md:ml-64" : ""}>
              <main className="p-4">
                {children}
              </main>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
