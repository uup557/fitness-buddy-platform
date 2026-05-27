import { Calendar, Clock, MapPin, Users, Dumbbell, Bike, Waves, Mountain, Heart, Users2 } from 'lucide-react';
import type { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  onJoin?: () => void;
}

const activityIcons: Record<string, typeof Dumbbell> = {
  running: Dumbbell,
  gym: Dumbbell,
  yoga: Heart,
  cycling: Bike,
  swimming: Waves,
  hiking: Mountain,
  team_sport: Users2,
};

const activityColors: Record<string, string> = {
  running: 'bg-red-100 text-red-600',
  gym: 'bg-orange-100 text-orange-600',
  yoga: 'bg-purple-100 text-purple-600',
  cycling: 'bg-green-100 text-green-600',
  swimming: 'bg-blue-100 text-blue-600',
  hiking: 'bg-amber-100 text-amber-600',
  team_sport: 'bg-pink-100 text-pink-600',
};

export default function ActivityCard({ activity, onJoin }: ActivityCardProps) {
  const Icon = activityIcons[activity.type] || Dumbbell;
  const colorClass = activityColors[activity.type] || 'bg-gray-100 text-gray-600';

  const participationPercent = (activity.currentParticipants / activity.maxParticipants) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-36 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`p-4 rounded-full ${colorClass}`}>
            <Icon className="h-12 w-12" />
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {activity.type === 'running' && '跑步'}
            {activity.type === 'gym' && '健身房'}
            {activity.type === 'yoga' && '瑜伽'}
            {activity.type === 'cycling' && '骑行'}
            {activity.type === 'swimming' && '游泳'}
            {activity.type === 'hiking' && '徒步'}
            {activity.type === 'team_sport' && '团队运动'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{activity.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{activity.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{activity.time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{activity.location}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {activity.currentParticipants}/{activity.maxParticipants} 人
              </span>
            </div>
            <span className="text-sm font-medium text-indigo-600">
              {(participationPercent).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${participationPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {activity.tags.map((tag) => (
            <span
              key={tag}
              className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>

        <button
          onClick={onJoin}
          className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          立即参加
        </button>
      </div>
    </div>
  );
}
