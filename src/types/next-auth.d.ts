import { DefaultSession } from "next-auth";
import { UserRoleType } from "./types";

// Extend User session type
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: UserRoleType;
    } & DefaultSession["employee"];
  }

  interface User {
    id: number;
    role: UserRoleType;
  }
}
