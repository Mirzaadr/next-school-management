import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalendar";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

interface BigCalendarContainerProps {
  type: "teacherId" | "classId";
  id:string | number;
  className?: string;
}

const BigCalendarContainer = async ({ type, id, className }:  BigCalendarContainerProps) => {

  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number }
      )
    }
  });

  const data = dataRes.map((lesson) => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
  }));
  
  const schedule = adjustScheduleToCurrentWeek(data);
  return (
    <div className="h-full bg-white p-4 rounded-md">
      <h1 className="text-xl font-semibold">Schedule {!!className && `(${className})`}</h1>
      <BigCalendar data={schedule}/>
    </div>
  )
}

export default BigCalendarContainer;