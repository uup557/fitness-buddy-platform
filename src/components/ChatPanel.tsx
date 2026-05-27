import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, Search, Paperclip, Menu } from 'lucide-react';
import type { Message } from '../types';
import { chatMessagesMap } from '../data/mockData';

interface ChatPanelProps {
  onToggleSidebar: () => void;
  activeChatId: string;
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
  }, [messages]);

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
        content: isDeepThinking 
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
    }, isDeepThinking ? 3000 : 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      <div className="h-16 border-b-2 border-gray-100 bg-white flex items-center px-6 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">
              {activeChatId === '1' ? '减脂备餐规划' : 
               activeChatId === '2' ? '运动计划建议' : 
               activeChatId === '3' ? '饮食咨询' : '新手入门指导'}
            </h2>
            <span className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full font-medium">
              <Lightbulb className="h-3 w-3" aria-hidden="true" />
              快速模式
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors" aria-label="上传文件">
              <Paperclip className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {messages.map((message) => (
            <div key={message.id} className="mb-6">
              <div className={`flex gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  {message.sender === 'user' ? (
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                      <User className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                  )}
                </div>

                <div className="flex-1 max-w-[85%]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {message.sender === 'user' ? '你' : 'AI 减脂教练'}
                    </span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>

                  <div className={`p-4 rounded-xl ${
                    message.sender === 'user'
                      ? 'bg-indigo-600 text-white ml-auto max-w-fit'
                      : 'bg-white text-gray-800 shadow-md border border-gray-100'
                  }`}>
                    <div className="message-content leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="mb-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                </div>

                <div className="flex-1 max-w-[85%]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-800">AI 减脂教练</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                    {isDeepThinking ? (
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-indigo-500 animate-pulse" aria-hidden="true" />
                        <span className="text-sm text-gray-600 font-medium">正在深度思考...</span>
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

      <div className="border-t-2 border-gray-100 bg-white p-4 sm:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-gray-200 bg-white">
              <button
                onClick={() => handleSend(true)}
                disabled={!inputValue.trim() || isTyping}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  inputValue.trim() && !isTyping
                    ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                深度思考
              </button>
              <button
                disabled={!inputValue.trim() || isTyping}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  inputValue.trim() && !isTyping
                    ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                智能搜索
              </button>
            </div>

            <div className="relative p-4">
              <label htmlFor="chat-input" className="sr-only">给 AI 减脂教练发送消息</label>
              <textarea
                id="chat-input"
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="给 AI 减脂教练发送消息..."
                className="w-full bg-transparent resize-none text-gray-800 placeholder-gray-400 focus:outline-none text-base"
                rows={2}
                style={{ maxHeight: '200px' }}
              />
              <div className="absolute right-4 bottom-4 flex items-center gap-3">
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" aria-label="上传文件">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleSend(false)}
                  disabled={!inputValue.trim() || isTyping}
                  className={`p-2 rounded-xl transition-all ${
                    inputValue.trim() && !isTyping
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label="发送消息"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-3">
            内容由 AI 生成，请仔细甄别
          </p>
        </div>
      </div>
    </div>
  );
}