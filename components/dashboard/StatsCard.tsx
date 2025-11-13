import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend: string;
  icon: React.ReactNode;
  iconBg: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, unit, trend, icon, iconBg }) => {
  const trendColor = trend.startsWith('+') ? 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-500/20' : 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-500/20';
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <div className="flex items-baseline mt-1">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-base text-gray-600 dark:text-gray-300 ml-1">{unit}</p>
        </div>
        <p className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full inline-block ${trendColor}`}>{trend}</p>
      </div>
    </div>
  );
};

export default StatsCard;
