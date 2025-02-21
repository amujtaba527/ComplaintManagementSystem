"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
