import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./zodSchema";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserByUsername } from "@/data/user";

export default {
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {}
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { username, password } = validatedFields.data;

          const user = await getUserByUsername(username);

          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(
            password,
            user.password,
          );

          if(passwordMatch) return user;
        }

        return null;
      }
    })
  ],
} satisfies NextAuthConfig;