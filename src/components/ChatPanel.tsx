import { useState, useRef, useEffect } from 'react';
import { Send, User, Lightbulb, Paperclip, Menu, Apple, Scale, Smile, Zap } from 'lucide-react';
import type { Message } from '../types';
import { chatMessagesMap } from '../data/mockData';

interface ChatPanelProps {
  onToggleSidebar: () => void;
  activeChatId: string;
}

/** 简单的 markdown 渲染：支持 **粗体** 和换行 */
function renderMessageContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatPanel({ onToggleSidebar, activeChatId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(chatMessagesMap[activeChatId] || []);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDeepThinking, setIsDeepThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages(chatMessagesMap[activeChatId] || []);
    setInputValue('');
    setIsTyping(false);
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  const handleSend = (deepThinking = false) => {
    if (!inputValue.trim() || isTyping) return;

    const newMessage: Message = {
      id: String(Date.now()),
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'text',
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsTyping(true);
    setIsDeepThinking(deepThinking);

    setTimeout(() => {
      const aiResponse: Message = {
        id: String(Date.now() + 1),
        content: deepThinking
          ? '好的，让我深度分析一下你的情况...\n\n根据你的问题，我来给你详细的建议！需要我继续深入吗？'
          : '收到你的消息！这是一个很好的问题。\n\n让我来帮你分析一下...',
        sender: 'ai',
        timestamp: new Date().toLocaleString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: 'text',
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
      setIsDeepThinking(false);
    }, deepThinking ? 3000 : 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(false);
    }
  };

  const quickActions = [
    { label: '记录饮食', icon: Apple, color: 'emerald', action: '我今天吃了：' },
    { label: '记录体重', icon: Scale, color: 'teal', action: '我今天体重是：' },
    { label: '记录心情', icon: Smile, color: 'green', action: '我今天的心情是：' },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30">
      {/* 顶部导航栏 */}
      <div className="h-16 border-b border-emerald-100 bg-white/70 backdrop-blur-sm flex items-center px-4 sm:px-6 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 hover:bg-emerald-50 rounded-xl transition-colors"
            >
              <Menu className="h-5 w-5 text-emerald-600" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              {activeChatId === '1' ? '减脂备餐规划' :
               activeChatId === '2' ? '运动计划建议' :
               activeChatId === '3' ? '饮食咨询' : '新手入门指导'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-medium border border-emerald-100">
              <Zap className="h-3 w-3" />
              快速模式
            </span>
          </div>
        </div>
      </div>

      {/* AI伙伴状态栏 */}
      <div className="px-4 sm:px-6 py-3 bg-white/50 border-b border-emerald-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-sm">🌱</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700">AI 减脂伙伴</p>
              <p className="text-[10px] text-emerald-500">养成等级 Lv.5</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-[10px] text-gray-400">经验值</p>
              <p className="text-xs font-bold text-emerald-600">2,450 / 3,000</p>
            </div>
            <div className="w-20 h-2 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-progress"
                style={{ width: '81.7%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className="mb-5 animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
            >
              <div className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* 头像 */}
                <div className="flex-shrink-0">
                  {message.sender === 'user' ? (
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-sm">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-2xl flex items-center justify-center shadow-sm">
                      <span className="text-base">🌱</span>
                    </div>
                  )}
                </div>

                {/* 消息内容 */}
                <div className={`flex-1 max-w-[85%] ${message.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-gray-600">
                      {message.sender === 'user' ? '你' : '🌱 AI伙伴'}
                    </span>
                    <span className="text-[10px] text-gray-400">{message.timestamp}</span>
                  </div>

                  <div className={`px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bubble-user text-gray-800 ml-auto max-w-fit'
                      : 'bubble-ai text-gray-800'
                  }`}>
                    <div className="message-content text-sm leading-relaxed whitespace-pre-line">
                      {renderMessageContent(message.content)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 打字指示器 */}
          {isTyping && (
            <div className="mb-5 animate-fade-in-up">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-base">🌱</span>
                  </div>
                </div>
                <div className="flex-1 max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-gray-600">🌱 AI伙伴</span>
                  </div>
                  <div className="bubble-ai px-4 py-3 rounded-2xl inline-block">
                    {isDeepThinking ? (
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-emerald-500 animate-pulse" />
                        <span className="text-sm text-emerald-600 font-medium">正在深度思考中...</span>
                      </div>
                    ) : (
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="border-t border-emerald-100 bg-white/70 backdrop-blur-sm p-3 sm:p-4 shadow-[0_-4px_20px_rgba(16,185,129,0.05)]">
        <div className="max-w-4xl mx-auto">
          {/* 快捷操作按钮 */}
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
            {quickActions.map((qa) => (
              <button
                key={qa.label}
                onClick={() => {
                  setInputValue(qa.action);
                  textareaRef.current?.focus();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium transition-all duration-200 border border-emerald-100 hover:border-emerald-200 whitespace-nowrap flex-shrink-0"
              >
                <qa.icon className="h-3.5 w-3.5" />
                {qa.label}
              </button>
            ))}
          </div>

          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl overflow-hidden focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100 transition-all duration-300">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-emerald-100/50 bg-white/50">
              <button
                onClick={() => handleSend(true)}
                disabled={!inputValue.trim() || isTyping}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  inputValue.trim() && !isTyping
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Lightbulb className="h-3.5 w-3.5" />
                深度思考
              </button>
            </div>

            <div className="relative p-3">
              <label htmlFor="chat-input" className="sr-only">给 AI 减脂伙伴发送消息</label>
              <textarea
                id="chat-input"
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="跟你的AI伙伴聊点什么..."
                className="w-full bg-transparent resize-none text-gray-800 placeholder-emerald-400/50 focus:outline-none text-sm"
                rows={2}
                style={{ maxHeight: '200px' }}
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <button className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors" aria-label="上传文件">
                  <Paperclip className="h-4 w-4 text-emerald-400" />
                </button>
                <button
                  onClick={() => handleSend(false)}
                  disabled={!inputValue.trim() || isTyping}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    inputValue.trim() && !isTyping
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200 hover:shadow-lg hover:scale-105'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label="发送消息"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-emerald-400 mt-2">
            🌱 内容由 AI 伙伴生成，请仔细甄别
          </p>
        </div>
      </div>
    </div>
  );
}
