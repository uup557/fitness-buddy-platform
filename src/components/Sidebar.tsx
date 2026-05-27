import { MessageCircle, Plus, Search, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

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
}

const mockChats: ChatItem[] = [
  { id: '1', title: '减脂备餐规划', preview: '好的，我来为你制定一份个性化的减脂计划...', time: '今天' },
  { id: '2', title: '运动计划建议', preview: '有氧运动：每周3-4次，每次30-45分钟...', time: '今天' },
  { id: '3', title: '饮食咨询', preview: '早餐建议：鸡蛋2个 + 全麦面包2片...', time: '2天前' },
  { id: '4', title: '新手入门指导', preview: '很高兴为你服务！请问今天有什么可以帮...', time: '1周前' },
];

export default function Sidebar({ activeChatId, onChatSelect, onCreateNewChat, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-white border-r-2 border-gray-200 flex flex-col transition-all duration-300 relative shadow-xl`}>
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 z-20 w-7 h-7 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      <div className={`p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white ${isCollapsed ? 'px-3' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <MessageCircle className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          {!isCollapsed && (
            <div>
              <span className="font-bold text-gray-900 text-base">AI 减脂教练</span>
              <p className="text-xs text-gray-500">健康生活好帮手</p>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <button
            onClick={onCreateNewChat}
            className="w-full flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            <span>开启新对话</span>
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="p-4 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <label htmlFor="search-input" className="sr-only">搜索对话</label>
            <input
              id="search-input"
              type="text"
              placeholder="搜索对话..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-3 bg-gradient-to-b from-white to-gray-50">
        {!isCollapsed && (
          <>
            <div className="mb-4 px-4">
              <p className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide">今天</p>
              {mockChats.slice(0, 2).map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 mb-2 ${
                    activeChatId === chat.id
                      ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 border-2 border-indigo-200 shadow-sm'
                      : 'hover:bg-gray-100 border-2 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{chat.title}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{chat.preview}</p>
                    </div>
                    <span className="text-xs text-indigo-600 font-medium flex-shrink-0">{chat.time}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mb-4 px-4">
              <p className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide">7天内</p>
              {mockChats.slice(2).map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 mb-2 ${
                    activeChatId === chat.id
                      ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 border-2 border-indigo-200 shadow-sm'
                      : 'hover:bg-gray-100 border-2 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{chat.title}</p>
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

      <div className={`p-4 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white ${isCollapsed ? 'px-3' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">AI 减脂教练</p>
                <p className="text-xs text-indigo-600">在线</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="更多选项">
                <MoreHorizontal className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}