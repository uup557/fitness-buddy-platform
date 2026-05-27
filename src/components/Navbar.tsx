import { MessageCircle, BarChart3, Bot } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const navItems = [
    { id: 'chat', label: 'AI 教练', icon: MessageCircle },
    { id: 'dashboard', label: '数据报告', icon: BarChart3 },
  ];

  return (
    <nav className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Bot className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">AI 减脂教练</span>
          </div>

          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-white/25 shadow-inner'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
