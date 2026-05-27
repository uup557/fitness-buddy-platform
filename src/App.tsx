import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ActivityCard from './components/ActivityCard';
import CommunityPostCard from './components/CommunityPostCard';
import UserCard from './components/UserCard';
import { mockActivities, mockCommunityPosts, mockUsers } from './data/mockData';
import { Calendar, Users, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="bg-gray-50 min-h-screen">
            <HeroBanner />

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800">热门活动</h2>
                </div>
                <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                  查看全部 →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </section>

            <section className="bg-white py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-800">推荐搭子</h2>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                    查看全部 →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {mockUsers.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-gray-50 py-12">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="h-6 w-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-800">社区动态</h2>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                    查看全部 →
                  </button>
                </div>
                <div className="space-y-4">
                  {mockCommunityPosts.map((post) => (
                    <CommunityPostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        );

      case 'activities':
        return (
          <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-8">发现活动</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'community':
        return (
          <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-8">社区广场</h1>
              <div className="space-y-4">
                {mockCommunityPosts.map((post) => (
                  <CommunityPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-8">消息中心</h1>
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">暂无消息</h3>
                <p className="text-gray-500">当你有新的消息时，会在这里显示</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
}
