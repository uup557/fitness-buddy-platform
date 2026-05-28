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
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void,
): Promise<string> {
  if (IS_PROD) {
    return sendViaServerless(messages, onChunk);
  }
  return sendDirectToMiMo(messages, onChunk);
}
