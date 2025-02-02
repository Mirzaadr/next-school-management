import UserCard from '@/components/UserCard';
import CountChart from '@/components/CountChart';
import React from 'react'
import AttendanceChart from '@/components/AttendanceChart';
import FinanceChart from '@/components/FinanceChart';
import EventCalendar from '@/components/EventCalendar';
import Announcements from '@/components/Announcements';

type Props = {}

const AdminPage = (props: Props) => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* LEFT */}
      <div className='w-full lg:w-2/3 flex flex-col gap-8'>
        <div className='flex gap-4 justify-between flex-wrap'>
          <UserCard type='Students'/>
          <UserCard type='Teachers'/>
          <UserCard type='Parents'/>
          <UserCard type='Staffs'/>
        </div>
        {/* MIDDLE CHARTS */}
        <div className='flex gap-4 flex-col lg:flex-row'>
          {/* COUNT CHARTS */}
          <div className='w-full lg:w-1/3 h-[450px]'>
            <CountChart />
          </div>
          {/* ATTENDANCE CHARTS */}
          <div className='w-full lg:w-2/3 h-[450px]'>
            <AttendanceChart />
          </div>
        </div>
        {/* BOTTOM CHARTS */}
        <div className='w-full h-[500px]'>
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className='w-full lg:w-1/3 flex flex-col gap-8'>
        {/* Calendar */}
        <EventCalendar />
        {/* Announcement */}
        <Announcements />
      </div>
    </div>
  )
}

export default AdminPage;