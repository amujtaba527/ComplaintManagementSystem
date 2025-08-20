"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";
import {Poppins} from "next/font/google";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body className={poppins.className}>
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
