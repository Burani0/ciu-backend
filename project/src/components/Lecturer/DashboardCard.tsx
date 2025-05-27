// import React from 'react';

interface DashboardCardProps {
  title: string;
  value: number;
  icon: string;
}

export default function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <div className="bg-[#e6f7ef] p-4 rounded-lg shadow-sm flex flex-1 flex-row">
      <div className="flex justify-between items-baseline flex-1 w-full">
        <div>
          <h3 className="text-[#105F53] text-[16px] mb-2 m-0">{title}</h3>
          <p className="text-[#105F53] text-[24px] font-bold flex">{value}</p>
        </div>
        <div className="text-[32px] text-[#105F53] flex">{icon}</div>
      </div>
    </div>
  );
}
