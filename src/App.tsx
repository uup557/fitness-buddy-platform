import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import DataDashboard from './components/DataDashboard';
import RecordPage from './components/RecordPage';
import ProfilePage from './components/ProfilePage';
import { MessageCircle, BarChart3, ClipboardList, User, Leaf } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'record' | 'profile'>('chat');
  const [activeChatId, setActiveChatId] = useState('1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const handleCreateNewChat = () => {
    const newId = String(Date.now());
    setActiveChatId(newId);
  };

  const handleTabSwitch = (tab: 'chat' | 'dashboard' | 'record' | 'profile') => {
    setActiveTab(tab);
    // 切换tab时关闭移动端侧边栏
    if (window.innerWidth < 1024) {
      setIsSidebarCollapsed(true);
    }
  };

  const navTabs = [
    { id: 'chat' as const, icon: MessageCircle, label: 'AI 对话' },
    { id: 'dashboard' as const, icon: BarChart3, label: '数据报告' },
    { id: 'record' as const, icon: ClipboardList, label: '记录' },
    { id: 'profile' as const, icon: User, label: '我的' },
  ];

  const getTabTitle = () => {
    const tab = navTabs.find(t => t.id === activeTab);
    return tab?.label || 'AI伙伴';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50/30">
      {/* 桌面端顶部导航栏 */}
      <header className="hidden lg:flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm z-40">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-xl shadow-sm">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-emerald-800 text-lg">AI 减脂伙伴</span>
        </div>

        {/* 主导航标签 - 4个tab */}
        <nav className="flex items-center bg-emerald-50/80 rounded-2xl p-1 gap-1">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-emerald-700 shadow-md shadow-emerald-100/50 scale-[1.02]'
                  : 'text-gray-500 hover:text-emerald-600 hover:bg-white/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
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
        {/* 侧边栏 - 仅在chat tab下显示 */}
        {activeTab === 'chat' && (
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
            onNavigateToTab={handleTabSwitch}
          />
        )}

        <div className="flex-1 flex flex-col min-h-0">
          {/* 移动端顶部栏 */}
          <div className="lg:hidden flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm border-b border-emerald-100">
            {activeTab !== 'chat' ? (
              <button
                onClick={() => handleTabSwitch('chat')}
                className="p-2 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-1"
              >
                <span className="text-sm font-medium text-emerald-700">← 返回</span>
              </button>
            ) : (
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 hover:bg-emerald-50 rounded-xl transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-emerald-600" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-lg">🌱</span>
              <span className="font-bold text-emerald-800">{getTabTitle()}</span>
            </div>
            <div className="w-9" />
          </div>

          {/* 内容区域 - 统一动画 */}
          <div className="flex-1 overflow-y-auto">
            <div className="animate-fade-in">
              {activeTab === 'chat' && (
                <ChatPanel
                  onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  activeChatId={activeChatId}
                />
              )}
              {activeTab === 'dashboard' && <DataDashboard />}
              {activeTab === 'record' && <RecordPage onNavigateToChat={() => handleTabSwitch('chat')} />}
              {activeTab === 'profile' && <ProfilePage />}
            </div>
          </div>
        </div>
      </div>

      {/* 底部导航栏 - 手机端 */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-emerald-100 z-50 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {navTabs.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSwitch(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600 scale-105'
                    : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50/50'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-emerald-500' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-xs font-medium ${isActive ? 'text-emerald-600' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
