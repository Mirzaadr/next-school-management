import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import { requireUser } from "@/hooks/requireUser";
import prisma from "@/lib/prisma";

const StudentPage = async ({ searchParams }: 
  { searchParams: { [key: string]: string | undefined } }
) => {
  const user = await requireUser();
  const classItem = await prisma.class.findFirstOrThrow({
    where: {
      students: { some: { id: user.profileId } }
    }
  })
  return (
    <div className='p-4 flex gap-4 flex-col xl:flex-row h-full'>
      {/* LEFT */}
      <div className="w-full h-full xl:w-2/3">
        <BigCalendarContainer type={"classId"} id={classItem.id} className={classItem.name}/>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams}/>
        <Announcements />
      </div>
    </div>
  )
}

export default StudentPage;