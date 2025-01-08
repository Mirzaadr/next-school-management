import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole,
  profileId: string,
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser,
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: UserRole,
    profileId: string | null,
  }
}