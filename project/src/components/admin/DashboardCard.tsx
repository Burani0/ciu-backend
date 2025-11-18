import React from 'react';

interface DashboardCardProps {
  title: string;
  value: number;
  icon: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-[#e6f7ef] p-4 rounded-md shadow-md flex flex-row w-full md:w-1/2 max-w-sm">
      <div className="flex justify-between items-baseline w-full text-[#105F53]">
        <div>
          <h3 className="text-base mb-2">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-[32px]">{icon}</div>
      </div>
    </div>
  );
};


export default DashboardCard;
