import { MapPin, Award, UserPlus } from 'lucide-react';
import type { User } from '../types';

interface UserCardProps {
  user: User;
  onFollow?: () => void;
}

export default function UserCard({ user, onFollow }: UserCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100"
          />
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
            {user.level}
          </span>
        </div>

        <h3 className="font-bold text-gray-800 text-lg mb-1">{user.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{user.bio}</p>

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{user.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Award className="h-4 w-4" />
            <span>{user.joinDate}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {user.fitnessGoals.map((goal) => (
            <span
              key={goal}
              className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs"
            >
              {goal}
            </span>
          ))}
        </div>

        <button
          onClick={onFollow}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          <span>关注</span>
        </button>
      </div>
    </div>
  );
}
