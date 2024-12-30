import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "../../../public/logo.png";
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid h-screen w-full md:grid-cols-[60px_1fr] lg:grid-cols-[260px_1fr]">
      {/* LEFT */}
      {/* <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4"> */}
      <div className="hidden border-r bg-muted/40 md:block md:p-2 lg:p-4 sticky h-screen overflow-auto">
        <div className="py-2 lg:px-2 lg:items-center justify-center flex w-full border-b">
          <Link href={"/"} className="flex items-center justify-center lg:justify-start gap-2">
            {/* <Image src={Logo} alt="logo" width={32} height={32}/> */}
            <Image src={Logo} alt="logo" className="size-12 md:size-8 mr-2"/>
            <p className="hidden lg:block text-2xl font-bold">
              Schoo
              <span className="text-blue-400">Llama</span>
            </p>
            {/* <span className="hidden lg:block">SchooLama</span> */}
          </Link>
        </div>
        <Menu />
      </div>
      {/* RIGHT */}
      <SessionProvider>
        <div className="w-full bg-[#F7F8FA] overflow-auto flex flex-col">
          <div className="sticky">
            <Navbar />
          </div>
          <div className="overflow-scroll">
              {children}
          </div>
        </div>
      </SessionProvider>
    </div>
  )
}