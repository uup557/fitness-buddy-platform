import type { VercelRequest, VercelResponse } from '@vercel/node';

const XIAOMI_BASE_URL = process.env.XIAOMI_BASE_URL || 'https://token-plan-cn.xiaomimimo.com/v1';
const XIAOMI_API_KEY = process.env.XIAOMI_API_KEY || '';

// AI伙伴的System Prompt — 温暖、支持、有点俏皮的减脂伙伴
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

## 你的能力
- 分析饮食记录，给出温和建议
- 制定运动计划，鼓励坚持
- 追踪体重变化，给予正向反馈
- 分享减脂知识和健康小贴士
- 在用户低落时给予情感支持

## 回复格式
- 使用Markdown格式：**粗体**强调重点
- 适当换行，让内容易读
- 每次回复控制在200字以内`;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!XIAOMI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages, stream = true } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    // 构建请求消息，注入system prompt
    const apiMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m: { content: string; sender: string }) => ({
        role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: m.content,
      })),
    ];

    const requestBody = {
      model: 'MiMo-V2-Flash',
      messages: apiMessages,
      stream,
      temperature: 0.8,
      max_tokens: 1024,
    };

    const response = await fetch(`${XIAOMI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XIAOMI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Xiaomi API error:', response.status, errorText);
      return res.status(502).json({ error: 'AI service error', details: errorText });
    }

    if (stream) {
      // 流式响应 — SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body?.getReader();
      if (!reader) {
        return res.status(500).json({ error: 'No response stream' });
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') {
                res.write('data: [DONE]\n\n');
              } else {
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    res.write(`data: ${JSON.stringify({ content })}\n\n`);
                  }
                } catch {
                  // skip malformed JSON
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Stream error:', err);
      } finally {
        res.end();
      }
    } else {
      // 非流式响应
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      return res.status(200).json({ content });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
