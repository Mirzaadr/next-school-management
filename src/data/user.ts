import prisma from "@/lib/prisma"

export const getUserByUsername = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    return user;
  } catch (error) {
    console.error("Unable to get user", error);
    return null;
  }
}

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    return user;
  } catch (error) {
    console.error("Unable to get user", error);
    return null;
  }
}

export const getUserById = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    return user;
  } catch (error) {
    console.error("Unable to get user", error);
    return null;
  }
}