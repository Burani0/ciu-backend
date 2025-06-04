import React from 'react';

interface DashboardCardProps {
  title: string;
  value: number;
  icon: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className=" w-64 bg-[#e6f7ef] p-4 rounded-md shadow-md flex flex-1 flex-row">
      <div className="flex justify-between items-baseline flex-1 w-full">
        <div className="text-[#105F53]">
          <h3 className="text-base mb-2">{title}</h3>
          <p className="text-2xl font-bold flex">{value}</p>
        </div>
        <div className="text-[#105F53] text-[32px] flex">
          {icon}
        </div>
      </div>
    </div>
    </div>
  );
};
// const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => {
//   return (
//     <div className="bg-[#e6f7ef] aspect-[1/1] p-4 rounded-md shadow-md flex flex-col justify-between text-[#105F53]">
//       <div>
//         <h3 className="text-base mb-2">{title}</h3>
//         <p className="text-2xl font-bold">{value}</p>
//       </div>
//       <div className="text-[32px] self-end">{icon}</div>
//     </div>
//   );
// };

export default DashboardCard;
