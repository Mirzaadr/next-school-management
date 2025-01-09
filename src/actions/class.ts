"use server"

import { ClassSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";

type CurrentState = {
  success: boolean;
  error: boolean;
}

export const createClass = async (currentState:CurrentState, data:ClassSchema) => {
  // const newName = data.get("name") as string;
  // const teachers = data.get("teachers");
  
  try {
    await prisma.class.create({
      data: {
        ...data
      },
    });
    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (error) {
    console.error(error)
    return { success: false, error: true };
  }  
}

export const updateClass = async (currentState:CurrentState, data:ClassSchema) => {
  // const subjectId = data.get("id") as string;
  // const newName = data.get("name") as string;
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data: {
        ...data
      },
    });
    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (error) {
    console.log(JSON.stringify(error))
    return { success: false, error: true };
  }  
}

export const deleteClass = async (currentState:CurrentState, data:FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });
    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (error) {
    console.error(error)
    return { success: false, error: true };
  }  
}