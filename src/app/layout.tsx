"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";
import {Poppins} from "next/font/google";
import Head from "next/head";

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
      <Head>
        <title>Complaint Management System</title>
        <meta name="description" content="Complaint Management System" />
        <meta property="og:title" content="Complaint Management System" />
        <meta property="og:description" content="Complaint Management System" />
      </Head> 
      <body className={poppins.className}>
        <SessionProvider>
          <div className="min-h-screen bg-gray-100">
          {!isLoginPage && <Navbar />}
          <div>
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
