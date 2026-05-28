// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (import.meta as any).env;
const IS_PROD = env?.PROD;

const SYSTEM_PROMPT = `你是"小绿"，一个温暖、有爱心、有点俏皮的AI减脂伙伴。你的核心理念是"陪伴用户一起变好"，而不是监督或批评。

## 你的性格
- 温暖鼓励型：用户做得好要真诚夸奖，做得不好要温柔引导
- 有幽默感：偶尔开个小玩笑，让对话轻松有趣
- 有同理心：理解减肥的辛苦，不会给用户压力
- 专业可靠：给出的饮食运动建议要有依据

## 对话规则
- 回复简洁温暖，像朋友聊天，不要太长
- 用emoji让对话更有温度 🌱💪✨
- 用户说吃了高热量食物：不要批评，先共情再引导
- 用户说不想运动：理解休息的重要性，鼓励但不强迫
- 适时分享减脂小知识，但不要变成说教
- 称呼用户为"你"，不要用"您"

## 回复格式
- 使用Markdown格式：**粗体**强调重点
- 适当换行，让内容易读
- 每次回复控制在200字以内`;

export interface ChatMessage {
  content: string;
  sender: 'user' | 'ai';
}

/** Offline fallback responses */
const OFFLINE_RESPONSES = [
  '嗨！我现在处于离线模式 🌱 虽然暂时连不上AI服务器，但基础功能都可以正常使用哦！\n\n你可以先浏览**数据报告**查看你的减脂进度，或者在**记录**页面记录今天的饮食和运动~',
  '抱歉，当前网络不太稳定 📶 不过别担心，你的数据都在本地保存着呢！\n\n试试先记录一下今天的饮食吧，等网络恢复了我再帮你分析~',
  '离线模式下我暂时不能回复，但你可以：\n\n📊 查看**数据报告**了解减脂趋势\n📝 在**记录**页面打卡饮食运动\n👥 浏览**社区**找健身搭子\n\n等网络恢复了再来找我聊天吧~ 💪',
  '网络好像断了呢 🌧️ 不过减脂不能停！\n\n建议你先做这些：\n- 记录今天的体重\n- 看看社区里其他小伙伴的分享\n- 检查一下今天的饮水量\n\n我等网络恢复了就回来陪你~ ✨',
];

function getOfflineResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes('饮食') || lower.includes('吃') || lower.includes('餐')) {
    return '关于饮食建议，我现在离线没法详细分析 🍽️\n\n不过有个简单原则：**多蛋白质、适量碳水、少油少糖**。\n\n等网络恢复了，告诉我你今天吃了什么，我帮你算热量~ 💪';
  }
  if (lower.includes('运动') || lower.includes('锻炼') || lower.includes('跑')) {
    return '运动建议我离线时给不了太具体的 🏃\n\n但记住：**动起来就比不动强！** 哪怕散步20分钟也是好的开始~\n\n等网络恢复了告诉我你的运动习惯，我帮你制定计划！💪';
  }
  if (lower.includes('体重') || lower.includes('称')) {
    return '体重记录很重要！⚖️\n\n建议你去**记录**页面打卡体重数据，每天固定时间称重最准确哦~\n\n等网络恢复了我帮你分析趋势 📊';
  }
  // Random fallback
  return OFFLINE_RESPONSES[Math.floor(Math.random() * OFFLINE_RESPONSES.length)];
}

/**
 * 流式解析SSE响应
 */
async function parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          fullText += content;
          onChunk?.(fullText);
        }
      } catch {
        // skip malformed
      }
    }
  }

  return fullText;
}

/**
 * Dev模式：直连MiMo API（流式）
 */
async function sendDirectToMiMo(
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const apiKey = env?.VITE_XIAOMI_API_KEY || '';
  const baseUrl = env?.VITE_XIAOMI_BASE_URL || 'https://token-plan-cn.xiaomimimo.com/v1';

  const apiMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.content,
    })),
  ];

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'mimo-v2.5',
      messages: apiMessages,
      stream: true,
      temperature: 0.8,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => 'Unknown error');
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response stream');

  return parseSSEStream(reader, onChunk);
}

/**
 * Prod模式：通过Vercel serverless function调用MiMo API
 */
async function sendViaServerless(
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, stream: true }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response stream');

  return parseSSEStream(reader, onChunk);
}

/**
 * 发送消息给AI并获取流式响应
 * 离线时返回友好的离线回复
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
  const userText = lastUserMsg?.content || '';

  try {
    // Quick connectivity check
    if (!navigator.onLine) {
      throw new Error('Offline');
    }

    if (IS_PROD) {
      return await sendViaServerless(messages, onChunk);
    }
    return await sendDirectToMiMo(messages, onChunk);
  } catch (err) {
    console.warn('Chat API unavailable, using offline fallback:', err);
    // Simulate streaming for offline response
    const offlineReply = getOfflineResponse(userText);
    if (onChunk) {
      let accumulated = '';
      for (let i = 0; i < offlineReply.length; i += 3) {
        accumulated = offlineReply.slice(0, i + 3);
        onChunk(accumulated);
        await new Promise(r => setTimeout(r, 20));
      }
      onChunk(offlineReply);
    }
    return offlineReply;
  }
}
