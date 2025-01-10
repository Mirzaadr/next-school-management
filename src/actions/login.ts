"use server"

import { getUserByEmail, getUserByUsername } from "@/data/user";
import { signIn } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { LoginSchema } from "@/lib/zodSchema";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { UserRole } from "@prisma/client";


export async function registerUser(data: {
  username: string;
  password: string;
  name: string;
  role: UserRole;
  email?: string;
}) {
  try {
    // TODO: check unique username or email 
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        username: data.username,
        name: data.name || null,
        password: hashedPassword,
        email: data.email || null,
        role: data.role,
      }
    });
    return user;
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);
  
  if(!validatedFields.success) {
    return {error: "invalid input"}
  }

  const { username, password } = validatedFields.data;

  const existingUser = await getUserByUsername(username);

  if (!existingUser || !existingUser.username || !existingUser.password) {
    return { error: "User does not exist" }
  }

  // if (!existingUser.emailVerified) {
  //   const verificationToken = await generateVerificationToken(
  //     existingUser.email,
  //   );

  //   await sendVerificationEmail(
  //     verificationToken.email,
  //     verificationToken.token
  //   )

  //   return { success: "Confirmation Email Sent" };
  // }

  // if (existingUser.isTwoFactorEnabled && existingUser.email) {
  //   if (code) {
  //     const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
  //     console.log(twoFactorToken);
  //     if (!twoFactorToken || (twoFactorToken.token !== code)) {
  //       return { error: "Invalid Code!" }
  //     }

  //     const hasExpired = new Date(twoFactorToken.expires) < new Date()
  //     if (hasExpired) {
  //       return { error: "Code Expired!" }
  //     }

  //     await db.twoFactorToken.delete({
  //       where: { id: twoFactorToken.id }
  //     });
      
  //     const existingConfirmation = await getTwoFactorConfirmationByUserId(
  //       existingUser.id
  //     );
      
  //     if (existingConfirmation) {
  //       await db.twoFactorConfirmation.delete({
  //         where: { id: existingConfirmation.id }
  //       });
  //     }
  //     await db.twoFactorConfirmation.create({
  //       data: {
  //         userId: existingUser.id,
  //       }
  //     });
  //   } else {
  //     const twoFactorToken = await generateTwoFactorToken(existingUser.email);
  //     await sendTwoFactorTokenEmail(
  //       existingUser.email,
  //       twoFactorToken.token,
  //     );
  
  //     return { twoFactor: true }
  //   }
  // }

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: `/${(existingUser.role).toLowerCase()}`,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {error: "Invalid Credentials"};
          break;
        default:
          return {error: "Something wrong"};
          break;
      }
    } 

    throw error;
  }
  return {success: "email sent"}
}