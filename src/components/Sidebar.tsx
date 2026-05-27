import { useState } from 'react';
import { Plus, Search, BarChart3, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface SidebarProps {
  activeChatId: string;
  onChatSelect: (id: string) => void;
  onCreateNewChat: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface ChatItem {
  id: string;
  title: string;
  preview: string;
  time?: string;
  status?: 'online' | 'thinking';
}

const mockChats: ChatItem[] = [
  { id: '1', title: '减脂备餐规划', preview: '好的，我来为你制定一份个性化的减脂计划...', time: '今天', status: 'online' },
  { id: '2', title: '运动计划建议', preview: '有氧运动：每周3-4次，每次30-45分钟...', time: '今天', status: 'online' },
  { id: '3', title: '饮食咨询', preview: '早餐建议：鸡蛋2个 + 全麦面包2片...', time: '2天前' },
  { id: '4', title: '新手入门指导', preview: '很高兴为你服务！请问今天有什么可以帮...', time: '1周前' },
];

export default function Sidebar({ activeChatId, onChatSelect, onCreateNewChat, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className={`${isCollapsed ? 'w-0 lg:w-20' : 'w-72'} h-screen bg-white/80 backdrop-blur-md border-r border-emerald-100 flex flex-col transition-all duration-300 relative shadow-lg shadow-emerald-100/50 overflow-hidden`}>
      {/* 折叠按钮 */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 z-20 w-7 h-7 bg-white border border-emerald-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:bg-emerald-50 transition-all duration-300"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-emerald-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-emerald-600" />
        )}
      </button>

      {/* 头部 - AI伙伴区域 */}
      <div className={`p-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-teal-50/50 ${isCollapsed ? 'px-3' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-200 animate-glow">
            <span className="text-xl">🌱</span>
          </div>
          {!isCollapsed && (
            <div>
              <span className="font-bold text-emerald-800 text-base">我的AI伙伴</span>
              <p className="text-xs text-emerald-500 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                随时陪你变好
              </p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={onCreateNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl shadow-md shadow-emerald-200 hover:shadow-lg transition-all duration-300 font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>开启新对话</span>
          </button>
        )}
      </div>

      {/* 搜索框 */}
      {!isCollapsed && (
        <div className="p-3 bg-white/50">
          <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
            <label htmlFor="search-input" className="sr-only">搜索对话</label>
            <input
              id="search-input"
              type="text"
              placeholder="搜索对话..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all duration-300 placeholder-emerald-400/60"
            />
          </div>
        </div>
      )}

      {/* 对话列表 */}
      <div className="flex-1 overflow-y-auto py-3 bg-gradient-to-b from-white/50 to-emerald-50/30">
        {!isCollapsed && (
          <>
            <div className="mb-3 px-4">
              <p className="px-3 py-2 text-xs font-bold text-emerald-600/60 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                今天
              </p>
              {mockChats.slice(0, 2).map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all duration-200 mb-1.5 ${
                    activeChatId === chat.id
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm'
                      : 'hover:bg-emerald-50/50 border border-transparent hover:border-emerald-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800 truncate">{chat.title}</p>
                        {chat.status === 'online' && (
                          <span className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0 animate-pulse" title="AI伙伴在线" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">{chat.preview}</p>
                    </div>
                    <span className="text-xs text-emerald-500 font-medium flex-shrink-0">{chat.time}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mb-3 px-4">
              <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wide">7天内</p>
              {mockChats.slice(2).map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all duration-200 mb-1.5 ${
                    activeChatId === chat.id
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm'
                      : 'hover:bg-emerald-50/50 border border-transparent hover:border-emerald-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{chat.title}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{chat.preview}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{chat.time}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 底部导航 */}
      <div className={`p-3 border-t border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-white ${isCollapsed ? 'px-3' : ''}`}>
        {/* 数据报告入口 */}
        {!isCollapsed && (
          <button
            onClick={() => {}}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-emerald-50 transition-all duration-200 mb-2 text-left group"
          >
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">数据报告</span>
          </button>
        )}
        {isCollapsed && (
          <button className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-emerald-50 transition-colors" title="数据报告">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
          </button>
        )}

        {/* AI伙伴状态 */}
        <div className={`flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-base">🌱</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-800">AI 减脂伙伴</p>
              <p className="text-xs text-emerald-500">Lv.5 · 在线陪你</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
