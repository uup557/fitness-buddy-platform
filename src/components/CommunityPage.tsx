import { useState } from 'react';
import { Users, Map, MessageSquare, UserPlus } from 'lucide-react';
import HeroBanner from './HeroBanner';
import ActivityCard from './ActivityCard';
import CommunityPostCard from './CommunityPostCard';
import UserCard from './UserCard';
import { mockActivities, mockCommunityPosts, mockUsers } from '../data/communityData';

type CommunityTab = 'activities' | 'posts' | 'users';

export default function CommunityPage() {
  const [subTab, setSubTab] = useState<CommunityTab>('activities');

  const subTabs = [
    { id: 'activities' as const, label: '活动', icon: Map },
    { id: 'posts' as const, label: '动态', icon: MessageSquare },
    { id: 'users' as const, label: '搭子', icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/30 pb-24 lg:pb-8">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Sub-navigation */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-2">
            {subTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = subTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSubTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {subTab === 'activities' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">热门活动</h2>
              <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-medium">
                <Users className="h-3.5 w-3.5 inline mr-1" />
                {mockActivities.length} 个活动进行中
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onJoin={() => alert(`已报名「${activity.title}」！`)}
                />
              ))}
            </div>
          </div>
        )}

        {subTab === 'posts' && (
          <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">社区动态</h2>
            {mockCommunityPosts.map((post) => (
              <CommunityPostCard
                key={post.id}
                post={post}
                onLike={() => {}}
              />
            ))}
          </div>
        )}

        {subTab === 'users' && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-6">推荐搭子</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {mockUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onFollow={() => alert(`已关注 ${user.name}！`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
