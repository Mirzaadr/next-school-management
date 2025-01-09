import { requireUser } from "@/hooks/requireUser";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma, UserRole } from "@prisma/client";

const itemListColors = [
  "bg-lamaSkyLight",
  "bg-lamaPurpleLight",
  "bg-lamaYellowLight",
]

const Announcements = async () => {
  const user = await requireUser();
  const role = user.role;

  const roleCondition = {
    "ADMIN": {},
    "TEACHER": {lessons: {some: {teacherId: user.profileId}}},
    "STUDENT": {students: {some: {id: user.profileId}}},
    "PARENT": {students: {some: {parentId: user.profileId}}},
  }

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: {date: "desc"},
    where: {
      ...(role !== "ADMIN" && {
        OR: [{ classId: null }, {class: roleCondition[role as keyof typeof roleCondition] || {}}]
      })
    }
  })
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data.map((item, index) => {
          return (
            <div key={item.id} className={`${itemListColors[index % 3]} rounded-md p-4`}>
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{item.title}</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                  {new Intl.DateTimeFormat('en-US').format(item.date)}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {item.description}
              </p>
            </div>
          );
        })}
        {/* <div className="bg-lamaSkyLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-01-01
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            expedita. Rerum, quidem facilis?
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Announcements;