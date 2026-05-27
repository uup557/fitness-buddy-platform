import { Dumbbell, Users, MessageCircle, Calendar, Search } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const navItems = [
    { id: 'home', label: '首页', icon: Dumbbell },
    { id: 'activities', label: '活动', icon: Calendar },
    { id: 'community', label: '社区', icon: Users },
    { id: 'messages', label: '消息', icon: MessageCircle },
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8" />
            <span className="text-xl font-bold">健身搭子</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-white/20 shadow-inner'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索活动或搭子..."
                className="bg-white/10 border border-white/20 rounded-full pl-10 pr-4 py-2 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
              发布活动
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
