"use server"

import { StudentSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import { registerUser } from "@/actions/login";

type CurrentState = {
  success: boolean;
  error: boolean;
}

export const createStudent = async (currentState:CurrentState, data:StudentSchema) => {
  try {
    const user = await registerUser({
      username: data.username,
      password: data.password,
      name: data.name + " " + data.surname,
      email: data.email,
      role: "STUDENT",
    });

    if (!user) {
      return { success: false, error: true };
    }

    await prisma.student.create({
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
        userId: user.id,

        parentId: data.parentId, 
        gradeId: data.gradeId, 
        classId: data.classId, 
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (error) {
    console.error(JSON.stringify(error));
    return { success: false, error: true };
  }  
}

export const updateStudent = async (currentState:CurrentState, data:StudentSchema) => {
  // const StudentId = data.get("id") as string;
  // const newName = data.get("name") as string;
  try {
    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (error) {
    console.log(JSON.stringify(error))
    return { success: false, error: true };
  }  
}

export const deleteStudent = async (currentState:CurrentState, data:FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.student.delete({
      where: {
        id: id,
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (error) {
    console.error(JSON.stringify(error))
    return { success: false, error: true };
  }  
}