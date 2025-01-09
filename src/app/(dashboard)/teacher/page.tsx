import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { requireUser } from "@/hooks/requireUser";

const TeachersPage = async () => {
  const user = await requireUser();
  return (
    <div className='p-4 flex gap-4 flex-col xl:flex-row flex-1 h-full'>
      {/* LEFT */}
      <div className="w-full h-full xl:w-2/3">
        <BigCalendarContainer id={user.profileId} type="teacherId"/>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  )
}

export default TeachersPage;