import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import authConfig from "./auth.config";
import { getUserById } from "@/data/user";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  session:{
    strategy: "jwt"
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      if(!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      if (existingUser.admin && existingUser.role === "ADMIN") {
        token.profileId = existingUser.admin.id;
      } else if (existingUser.student && existingUser.role === "STUDENT") {
        token.profileId = existingUser.student.id;
      } else if (existingUser.teacher && existingUser.role === "TEACHER") {
        token.profileId = existingUser.teacher.id;
      } else if (existingUser.parent && existingUser.role === "PARENT") {
        token.profileId = existingUser.parent.id;
      } else {
        token.profileId = null;
      }

      return token;
    },
  },
});