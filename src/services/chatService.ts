// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_BASE = (import.meta as any).env?.PROD ? '' : 'http://localhost:3000';

export interface ChatMessage {
  content: string;
  sender: 'user' | 'ai';
}

/**
 * 发送消息给AI并获取流式响应
 * @param messages 历史消息列表
 * @param onChunk 收到每个chunk时的回调
 * @returns 完整的AI回复
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const response = await fetch(`${API_BASE}/api/chat`, {
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
        if (parsed.content) {
          fullText += parsed.content;
          onChunk?.(fullText);
        }
      } catch {
        // skip malformed
      }
    }
  }

  return fullText;
}
