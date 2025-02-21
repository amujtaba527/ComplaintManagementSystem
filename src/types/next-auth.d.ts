import NextAuth, { DefaultSession } from "next-auth";

// Extend User session type
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: "admin" | "employee";
    } & DefaultSession["employee"];
  }

  interface User {
    id: number;
    role: "admin" | "employee";
  }
}
