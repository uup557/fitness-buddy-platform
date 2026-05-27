import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import DataDashboard from './components/DataDashboard';
import { Menu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [activeChatId, setActiveChatId] = useState('1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleCreateNewChat = () => {
    const newId = String(Date.now());
    setActiveChatId(newId);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {activeTab === 'chat' && (
        <Sidebar
          activeChatId={activeChatId}
          onChatSelect={setActiveChatId}
          onCreateNewChat={handleCreateNewChat}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}
      
      <div className="flex-1 flex flex-col">
        {activeTab === 'chat' && (
          <div className="lg:hidden p-4 bg-white border-b">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        )}
        
        {activeTab === 'chat' && (
          <ChatPanel
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            activeChatId={activeChatId}
          />
        )}
        {activeTab === 'dashboard' && <DataDashboard />}
        
        {activeTab === 'dashboard' && (
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={() => setActiveTab('chat')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
            >
              ← 返回 AI 教练
            </button>
          </div>
        )}
      </div>
    </div>
  );
}