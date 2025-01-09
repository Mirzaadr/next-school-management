import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { requireUser } from "@/hooks/requireUser";
import prisma from "@/lib/prisma";

const ParentPage = async () => {
  const user = await requireUser();
  const students = await prisma.student.findMany({
    where: {
      parentId: user.profileId,
    }
  });
  
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row flex-1 h-full">
      {/* LEFT */}
      <>
        {students.map((student) => (
          <div className="w-full xl:w-2/3" key={student.id}>
            <BigCalendarContainer
              className={student.name + " " + student.surname}
              id={student.classId}
              type="classId"
            />
          </div>
        ))}
      </>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
}

export default ParentPage