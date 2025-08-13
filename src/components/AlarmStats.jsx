// components/AlarmStats.jsx
import React from 'react';
import { AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { calculateAlarmStats } from '../utils/alarmUtils';

const StatCard = ({ title, value, color, bgColor, icon: Icon, subtitle }) => (
  <div
    className={`${bgColor} rounded-2xl shadow-lg p-6 w-full h-full flex flex-col justify-between 
    ${bgColor.includes('red') ? 'border border-red-100' : bgColor.includes('green') ? 'border border-green-100' : ''}`}
  >
    <div className="flex flex-col justify-between h-full">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className={`text-4xl font-bold ${color} mt-2`}>{value}</p>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
      </div>
      {Icon && (
        <div
          className={`${color.includes('red') ? 'bg-red-100' : color.includes('green') ? 'bg-green-100' : 'bg-indigo-100'} 
          p-4 rounded-xl self-end`}
        >
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      )}
    </div>
  </div>
);


export const AlarmStats = ({ alarms }) => {
  const stats = calculateAlarmStats(alarms);

  return (
    <div
     className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6"
    >
      <StatCard 
        title="Total Alarms" 
        value={stats.total} 
        color="text-gray-800" 
        bgColor="bg-gray-50"
        icon={Bell}
 
      />
      <StatCard 
        title="Active Alarms" 
        value={stats.active} 
        color="text-red-600" 
        bgColor="bg-red-50" 
        icon={AlertTriangle}
       
      />
      <StatCard 
        title="Resolved Alarms" 
        value={stats.inactive} 
        color="text-green-600" 
        bgColor="bg-green-50" 
        icon={CheckCircle}
      
      />
    </div>
  );
};
