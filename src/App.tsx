import { useState } from 'react';
import Navbar from './components/Navbar';
import ChatPanel from './components/ChatPanel';
import DataDashboard from './components/DataDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'chat' && <ChatPanel />}
      {activeTab === 'dashboard' && <DataDashboard />}
    </div>
  );
}
