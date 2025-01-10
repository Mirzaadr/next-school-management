import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { Teacher } from "@prisma/client";

export interface IFormProps {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
}

const FormContainer = async ({
  table,
  type,
  data,
  id,
}: IFormProps) => {
  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true, }
        });
        relatedData = { teachers: subjectTeachers };
        if (data && data.teachers ) {
          const teachersSelected = data.teachers.map((teacher: Teacher) => teacher.id)
          data.teachers = teachersSelected;
        }
        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true, }
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;
    
      default:
        break;
    }
  }
  return (
    <div className=''>
      <FormModal 
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  )
}

export default FormContainer;