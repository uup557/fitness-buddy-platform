import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import DataDashboard from './components/DataDashboard';
import CommunityPage from './components/CommunityPage';
import RecordPage from './components/RecordPage';
import ProfilePage from './components/ProfilePage';
import { MessageCircle, BarChart3, ClipboardList, User, Leaf, ArrowLeft, Users, Map } from 'lucide-react';

export type AppTab = 'chat' | 'community' | 'record' | 'dashboard' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('chat');
  const [activeChatId, setActiveChatId] = useState('1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const handleCreateNewChat = () => {
    const newId = String(Date.now());
    setActiveChatId(newId);
  };

  const switchTab = (tab: AppTab) => {
    setActiveTab(tab);
    // Auto-collapse sidebar when switching away from chat
    if (tab !== 'chat') {
      setIsSidebarCollapsed(true);
    }
  };

  // Desktop header nav items
  const desktopNavItems = [
    { id: 'chat' as const, label: 'AI 对话', icon: MessageCircle },
    { id: 'community' as const, label: '社区', icon: Users },
    { id: 'record' as const, label: '记录', icon: ClipboardList },
    { id: 'dashboard' as const, label: '数据', icon: BarChart3 },
    { id: 'profile' as const, label: '我的', icon: User },
  ];

  // Mobile bottom nav items
  const mobileNavItems = [
    { id: 'chat' as const, label: '对话', icon: MessageCircle },
    { id: 'community' as const, label: '社区', icon: Map },
    { id: 'record' as const, label: '记录', icon: ClipboardList },
    { id: 'dashboard' as const, label: '数据', icon: BarChart3 },
    { id: 'profile' as const, label: '我的', icon: User },
  ];

  // Which tabs show the sidebar
  const showSidebar = activeTab === 'chat';

  // Mobile top bar config
  const getMobileTopBar = () => {
    if (activeTab === 'dashboard') {
      return {
        left: (
          <button
            onClick={() => switchTab('chat')}
            className="p-2 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">返回</span>
          </button>
        ),
        title: '数据报告',
      };
    }
    if (activeTab === 'community') {
      return { left: <div className="w-9" />, title: '健身社区' };
    }
    if (activeTab === 'record') {
      return { left: <div className="w-9" />, title: '记录' };
    }
    if (activeTab === 'profile') {
      return { left: <div className="w-9" />, title: '我的' };
    }
    // chat tab
    return {
      left: (
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="p-2 hover:bg-emerald-50 rounded-xl transition-colors"
        >
          <MessageCircle className="h-5 w-5 text-emerald-600" />
        </button>
      ),
      title: 'AI伙伴',
    };
  };

  const mobileBar = getMobileTopBar();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50/30">
      {/* Desktop top nav */}
      <header className="hidden lg:flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm z-40">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-xl shadow-sm">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-emerald-800 text-lg">AI 减脂伙伴</span>
        </div>

        <nav className="flex items-center bg-emerald-50/80 rounded-2xl p-1 gap-1">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => switchTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-emerald-700 shadow-md shadow-emerald-100/50 scale-[1.02]'
                    : 'text-gray-500 hover:text-emerald-600 hover:bg-white/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
            <span className="text-sm">🌱</span>
            <span className="text-xs font-semibold text-emerald-700">Lv.5</span>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            AI
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - only on chat tab */}
        {showSidebar && (
          <Sidebar
            activeChatId={activeChatId}
            onChatSelect={(id) => {
              setActiveChatId(id);
              if (window.innerWidth < 1024) {
                setIsSidebarCollapsed(true);
              }
            }}
            onCreateNewChat={handleCreateNewChat}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onNavigateToDashboard={() => switchTab('dashboard')}
          />
        )}

        <div className="flex-1 flex flex-col min-h-0">
          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm border-b border-emerald-100">
            {mobileBar.left}
            <div className="flex items-center gap-2">
              <span className="text-lg">🌱</span>
              <span className="font-bold text-emerald-800">{mobileBar.title}</span>
            </div>
            <div className="w-9" />
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto">
            <div className={`transition-all duration-300 ${
              activeTab === 'chat' || activeTab === 'dashboard' ? 'animate-fade-in' : ''
            }`}>
              {activeTab === 'chat' && (
                <ChatPanel
                  onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  activeChatId={activeChatId}
                />
              )}
              {activeTab === 'dashboard' && <DataDashboard />}
              {activeTab === 'community' && <CommunityPage />}
              {activeTab === 'record' && <RecordPage />}
              {activeTab === 'profile' && <ProfilePage />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-emerald-100 z-50 safe-area-pb">
        <div className="flex items-center justify-around px-1 py-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => switchTab(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600 scale-105'
                    : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50/50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-500' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-xs font-medium ${isActive ? 'text-emerald-600' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
