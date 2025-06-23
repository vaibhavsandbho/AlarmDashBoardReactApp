// components/AlarmStats.jsx
import React from 'react';
import { AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { calculateAlarmStats } from '../utils/alarmUtils';

const StatCard = ({ title, value, color, bgColor, icon: Icon }) => (
  <div className={`${bgColor} p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      {Icon && <Icon className={`w-8 h-8 ${color.replace('text-', 'text-').replace('-900', '-400')}`} />}
    </div>
  </div>
);

export const AlarmStats = ({ alarms }) => {
  const stats = calculateAlarmStats(alarms);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard title="Total Alarms" value={stats.total} color="text-gray-900" bgColor="bg-white" icon={Bell} />
      <StatCard title="Active Alarms" value={stats.active} color="text-red-600" bgColor="bg-red-50" icon={AlertTriangle} />
      <StatCard title="Inactive Alarms" value={stats.inactive} color="text-green-600" bgColor="bg-green-50" icon={CheckCircle} />
    </div>
  );
};