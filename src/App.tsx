import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import DataDashboard from './components/DataDashboard';
import { MessageCircle, BarChart3, ClipboardList, User, Leaf, ArrowLeft } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'record' | 'profile'>('chat');
  const [activeChatId, setActiveChatId] = useState('1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const handleCreateNewChat = () => {
    const newId = String(Date.now());
    setActiveChatId(newId);
  };

  const handleTabSwitch = (tab: 'chat' | 'dashboard') => {
    setActiveTab(tab);
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

        {/* 主导航标签 */}
        <nav className="flex items-center bg-emerald-50/80 rounded-2xl p-1 gap-1">
          <button
            onClick={() => handleTabSwitch('chat')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'chat'
                ? 'bg-white text-emerald-700 shadow-md shadow-emerald-100/50 scale-[1.02]'
                : 'text-gray-500 hover:text-emerald-600 hover:bg-white/50'
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            AI 对话
          </button>
          <button
            onClick={() => handleTabSwitch('dashboard')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'dashboard'
                ? 'bg-white text-emerald-700 shadow-md shadow-emerald-100/50 scale-[1.02]'
                : 'text-gray-500 hover:text-emerald-600 hover:bg-white/50'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            数据报告
          </button>
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
          />
        )}

        <div className="flex-1 flex flex-col min-h-0">
          {/* 移动端顶部栏 */}
          <div className="lg:hidden flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm border-b border-emerald-100">
            {activeTab === 'dashboard' ? (
              <button
                onClick={() => setActiveTab('chat')}
                className="p-2 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">返回</span>
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
              <span className="font-bold text-emerald-800">
                {activeTab === 'dashboard' ? '数据报告' : 'AI伙伴'}
              </span>
            </div>
            {activeTab === 'dashboard' ? (
              <div className="w-9" />
            ) : (
              <div className="w-9" />
            )}
          </div>

          {/* 内容区域 - 带切换动画 */}
          <div className="flex-1 overflow-y-auto">
            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === 'chat'
                  ? 'animate-fade-in'
                  : activeTab === 'dashboard'
                  ? 'animate-fade-in'
                  : ''
              }`}
            >
              {activeTab === 'chat' && (
                <ChatPanel
                  onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  activeChatId={activeChatId}
                />
              )}
              {activeTab === 'dashboard' && <DataDashboard />}
            </div>

            {activeTab === 'record' && (
              <div className="flex-1 flex items-center justify-center p-8 min-h-[60vh]">
                <div className="text-center space-y-4 animate-fade-in-up">
                  <div className="text-6xl">📝</div>
                  <h2 className="text-2xl font-bold text-emerald-800">记录你的成长</h2>
                  <p className="text-emerald-600 max-w-md">
                    在对话中直接告诉 AI 伙伴你的饮食、运动、体重数据，TA会帮你记录并分析哦~
                  </p>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="mt-4 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-medium shadow-lg shadow-emerald-200 transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    开始记录 →
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="flex-1 flex items-center justify-center p-8 min-h-[60vh]">
                <div className="text-center space-y-4 animate-fade-in-up">
                  <div className="text-6xl">👤</div>
                  <h2 className="text-2xl font-bold text-emerald-800">我的主页</h2>
                  <p className="text-emerald-600 max-w-md">
                    个人资料和设置功能即将上线，敬请期待~
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部导航栏 - 手机端 */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-emerald-100 z-50 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { id: 'chat' as const, icon: MessageCircle, label: '对话' },
            { id: 'record' as const, icon: ClipboardList, label: '记录' },
            { id: 'dashboard' as const, icon: BarChart3, label: '数据' },
            { id: 'profile' as const, icon: User, label: '我的' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
