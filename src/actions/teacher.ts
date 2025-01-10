"use server"

import { TeacherSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

type CurrentState = {
  success: boolean;
  error: boolean;
}

const registerUser = async (data: {
  username: string;
  password: string;
  name: string;
  email?: string;
}) => {
  try {
    // TODO: check unique username or email 
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        username: data.username,
        name: data.name || null,
        password: hashedPassword,
        email: data.email || "",
        role: "TEACHER",
      }
    });
    return user;
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

export const createTeacher = async (currentState:CurrentState, data:TeacherSchema) => {
  try {
    const user = await registerUser({
      username: data.username,
      password: data.password,
      name: data.name + " " + data.surname,
      email: data.email,
    });

    if (!user) {
      return { success: false, error: true };
    }

    await prisma.teacher.create({
      data: {
        id: user.id,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        // img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
        userId: user.id,
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    console.error(JSON.stringify(error));
    return { success: false, error: true };
  }  
}

export const updateTeacher = async (currentState:CurrentState, data:TeacherSchema) => {
  // const TeacherId = data.get("id") as string;
  // const newName = data.get("name") as string;
  try {
    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    console.log(JSON.stringify(error))
    return { success: false, error: true };
  }  
}

export const deleteTeacher = async (currentState:CurrentState, data:FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    console.error(error)
    return { success: false, error: true };
  }  
}