import Image from "next/image";
import Link from "next/link";
import { role } from "@/lib/data";
import { SheetClose } from "@/components/ui/sheet";
import React from "react";

export const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

interface MenuProps {
  inSheet?: boolean
}

const Menu = ({ inSheet }: MenuProps) => {
  const [SheetCloseWrapper, sheetCloseWrapperProps] = inSheet
    ? [SheetClose, { asChild: true }]
    : [React.Fragment, {}];
  return (
    <div className="mt-2 text-sm">
      {menuItems.map((menu) => (
        <div className="flex flex-col gap-2" key={menu.title}>
          <span className={`${inSheet ? "block" : "hidden lg:block"} text-gray-400 font-light my-2`}>{menu.title}</span>
          {menu.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <SheetCloseWrapper {...sheetCloseWrapperProps} key={item.label}>
                  <Link href={item.href} key={item.label} className={
                    `flex items-center  gap-4 text-gray-500 py-2 rounded-md hover:bg-lamaSkyLight
                    ${inSheet ? "justify-start px-2" : "justify-center lg:justify-start md:px-2"}`
                    }>
                    <Image
                      src={item.icon}
                      alt={`${menu.title}-${item.label}`}
                      width={20}
                      height={20}
                    />
                    <span className={`${inSheet ? "block" : "hidden lg:block"}`}>{item.label}</span>
                  </Link>
                </SheetCloseWrapper>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
}

export default Menu;