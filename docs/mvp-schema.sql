-- ============================================
-- AI减脂伙伴 MVP - 核心表
-- 在Supabase SQL Editor中执行
-- ============================================

-- 1. 用户档案
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT,
  nickname TEXT DEFAULT '小伙伴',
  target_weight DECIMAL(5,1),
  start_weight DECIMAL(5,1),
  ai_persona TEXT DEFAULT 'xiaolv',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 体重记录
CREATE TABLE IF NOT EXISTS weight_records (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  weight DECIMAL(5,1) NOT NULL,
  note TEXT,
  recorded_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 对话会话
CREATE TABLE IF NOT EXISTS chat_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT '新对话',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 对话消息
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS（行级安全）
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS策略：用户只能操作自己的数据
CREATE POLICY "own_profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "own_weight" ON weight_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_sessions" ON chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_messages" ON chat_messages FOR ALL USING (auth.uid() = user_id);

-- 6. 注册自动建profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, phone) VALUES (NEW.id, NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 7. 索引
CREATE INDEX IF NOT EXISTS idx_weight_user ON weight_records(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_session ON chat_messages(session_id, created_at);
