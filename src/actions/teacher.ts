"use server"

import { TeacherSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";

type CurrentState = {
  success: boolean;
  error: boolean;
}

export const createTeacher = async (currentState:CurrentState, data:TeacherSchema) => {
  // const newName = data.get("name") as string;
  // const teachers = data.get("teachers");
  
  try {
    // await prisma.teacher.create({
    //   data: {
    //     ...data
    //   },
    // });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    console.error(error)
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