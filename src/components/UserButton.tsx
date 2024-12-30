"use client"
import React from 'react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import LogoutButton from '@/components/LogoutButton';
import { LogOutIcon, UserCircle2 } from 'lucide-react';
import Image from 'next/image';

type Props = {
  label?: string;
};

const UserButton = (props: Props) => {
  const user = useCurrentUser();

  return (
    <>
      <div className='hidden md:flex flex-col'>
        <span className="text-xs leading-3 font-medium">{user?.name}</span>
        <span className="text-[10px] text-gray-500 text-right">Admin</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-40' align='end'>
          <LogoutButton>
            <DropdownMenuItem>
              <LogOutIcon className='size-4 mr-2' />
              Logout
            </DropdownMenuItem>
          </LogoutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default UserButton;