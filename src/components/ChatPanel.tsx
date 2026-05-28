import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Lightbulb, Paperclip, Menu, AlertCircle } from 'lucide-react';
import type { Message } from '../types';
import { chatMessagesMap } from '../data/mockData';
import { sendChatMessage } from '../services/chatService';

interface ChatPanelProps {
  onToggleSidebar: () => void;
  activeChatId: string;
}

export default function ChatPanel({ onToggleSidebar, activeChatId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(chatMessagesMap[activeChatId] || []);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages(chatMessagesMap[activeChatId] || []);
    setInputValue('');
    setIsTyping(false);
    setStreamingText('');
    setError(null);
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
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

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setStreamingText('');
    setError(null);

    // 构建发送给API的消息历史（只取最近10条避免token过多）
    const recentMessages = [...messages, userMessage].slice(-10).map(m => ({
      content: m.content,
      sender: m.sender,
    }));

    try {
      const fullText = await sendChatMessage(
        recentMessages,
        (text) => setStreamingText(text),
      );

      // 流式完成，添加完整消息
      const aiMessage: Message = {
        id: String(Date.now() + 1),
        content: fullText || '抱歉，我暂时无法回复，请稍后再试~',
        sender: 'ai',
        timestamp: new Date().toLocaleString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: 'text',
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : '发送失败，请稍后再试');
    } finally {
      setIsTyping(false);
      setStreamingText('');
    }
  }, [inputValue, isTyping, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 简单的markdown渲染：**粗体** 和换行
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-emerald-800">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const chatTitle =
    activeChatId === '1' ? '减脂备餐规划' :
    activeChatId === '2' ? '运动计划建议' :
    activeChatId === '3' ? '饮食咨询' : '新手入门指导';

  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      {/* 顶部栏 */}
      <div className="h-16 border-b-2 border-gray-100 bg-white flex items-center px-6 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">{chatTitle}</h2>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-medium">
              <Lightbulb className="h-3 w-3" />
              AI 模式
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
              <Paperclip className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {messages.map((message) => (
            <div key={message.id} className="mb-6 animate-fade-in-up">
              <div className={`flex gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  {message.sender === 'user' ? (
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-white">你</span>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-base">🌱</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 max-w-[85%]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {message.sender === 'user' ? '你' : '小绿 AI'}
                    </span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>

                  <div className={`p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-emerald-500 text-white ml-auto max-w-fit shadow-md shadow-emerald-200/50'
                      : 'bubble-ai text-gray-800 shadow-sm'
                  }`}>
                    <div className="message-content leading-relaxed whitespace-pre-wrap">
                      {renderContent(message.content)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 流式输出中的消息 */}
          {isTyping && streamingText && (
            <div className="mb-6 animate-fade-in-up">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-base">🌱</span>
                  </div>
                </div>
                <div className="flex-1 max-w-[85%]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-800">小绿 AI</span>
                  </div>
                  <div className="bubble-ai p-4 rounded-2xl shadow-sm text-gray-800">
                    <div className="message-content leading-relaxed whitespace-pre-wrap">
                      {renderContent(streamingText)}
                      <span className="inline-block w-2 h-4 bg-emerald-500 ml-1 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 打字动画（等待API响应时） */}
          {isTyping && !streamingText && (
            <div className="mb-6 animate-fade-in-up">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-base">🌱</span>
                  </div>
                </div>
                <div className="flex-1 max-w-[85%]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-800">小绿 AI</span>
                  </div>
                  <div className="bubble-ai p-4 rounded-2xl shadow-sm">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 animate-fade-in-up">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600 text-sm"
              >
                关闭
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="border-t-2 border-gray-100 bg-white p-4 sm:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden">
            {/* 快捷操作 */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-gray-200 bg-white">
              <button
                onClick={() => { setInputValue('我今天吃了：'); }}
                disabled={isTyping}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
              >
                🍽️ 记录饮食
              </button>
              <button
                onClick={() => { setInputValue('我今天体重是：'); }}
                disabled={isTyping}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                ⚖️ 记录体重
              </button>
              <button
                onClick={() => { setInputValue('我今天的心情是：'); }}
                disabled={isTyping}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
              >
                😊 记录心情
              </button>
            </div>

            <div className="relative p-4">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="和小绿聊聊你的减脂日常..."
                className="w-full bg-transparent resize-none text-gray-800 placeholder-gray-400 focus:outline-none text-base"
                rows={2}
                style={{ maxHeight: '200px' }}
                disabled={isTyping}
              />
              <div className="absolute right-4 bottom-4 flex items-center gap-3">
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isTyping}
                  className={`p-2 rounded-xl transition-all ${
                    inputValue.trim() && !isTyping
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-200/50'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="h-4 w-4" />
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
