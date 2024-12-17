import React from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14% p-4">
        sidebar
      </div>
      {/* RIGHT */}
      <div className="w-full bg-[#F7F8FA] overflow-scroll">
        {children}
      </div>
    </div>
  )
}