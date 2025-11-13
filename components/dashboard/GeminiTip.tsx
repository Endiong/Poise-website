import React from 'react';
import { SparklesIcon, VideoCameraIcon, TrophyIcon } from '../icons/Icons';
import { ViewType } from '../../types';

interface Activity {
  type: 'tip' | 'session' | 'goal';
  title: string;
  description: string;
  time: string;
}

const mockActivities: Activity[] = [
    {
        type: 'tip',
        title: 'Poisé AI sent a tip',
        description: 'Remember to keep your shoulders relaxed and down, away from your ears.',
        time: 'Just now',
      },
      {
        type: 'session',
        title: 'Session Complete',
        description: 'You achieved a 92% posture score over 4.5 hours.',
        time: '15m ago',
      },
      {
        type: 'goal',
        title: 'Daily Goal Met!',
        description: 'You surpassed your 85% goal for today. Great job!',
        time: '2h ago',
      },
      {
        type: 'tip',
        title: 'Poisé AI sent a tip',
        description: 'Try to align your ears with your shoulders to avoid forward head posture.',
        time: 'Yesterday',
      },
];

const getActivityIcon = (type: Activity['type']) => {
    const commonClass = "w-4 h-4 text-white";
    switch(type) {
        case 'tip': return <SparklesIcon className={commonClass} />;
        case 'session': return <VideoCameraIcon className={commonClass} />;
        case 'goal': return <TrophyIcon className={commonClass} />;
        default: return null;
    }
}
const getIconBgColor = (type: Activity['type']) => {
    switch(type) {
        case 'tip': return 'bg-indigo-500';
        case 'session': return 'bg-blue-500';
        case 'goal': return 'bg-green-500';
        default: return 'bg-gray-500';
    }
}

const ActivityItem: React.FC<{activity: Activity}> = ({ activity }) => {
    return (
        <div className="flex gap-3">
            <div className={`w-8 h-8 rounded-full mt-1 ${getIconBgColor(activity.type)} flex items-center justify-center flex-shrink-0`}>
                {getActivityIcon(activity.type)}
            </div>
            <div>
                 <p className="text-sm">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{activity.title}</span>
                 </p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                 <div className={`mt-2 text-sm text-gray-700 dark:text-gray-300 ${activity.type === 'tip' ? 'bg-indigo-100/60 dark:bg-indigo-900/50 p-3 rounded-lg rounded-tl-none' : ''}`}>
                    {activity.description}
                </div>
            </div>
        </div>
    );
};


const ActivityFeed: React.FC<{ onNavigate: (view: ViewType) => void }> = ({ onNavigate }) => {
  return (
    <div className="mt-4">
        <div className="space-y-6">
            {mockActivities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
            ))}
        </div>
        <button 
            onClick={() => onNavigate('history')}
            className="w-full mt-6 text-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-md py-1"
        >
            View Full History
        </button>
    </div>
  );
};

export default ActivityFeed;
