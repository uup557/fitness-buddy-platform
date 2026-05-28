-- ============================================
-- AI减脂伙伴 - Supabase数据库Schema
-- 版本：MVP v1.0
-- 设计原则：最小可用，只建MVP必须的表
-- ============================================

-- 1. 用户档案（Supabase Auth自动创建，这里扩展业务字段）
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT,                          -- 手机号
  nickname TEXT DEFAULT '小伙伴',       -- 昵称
  avatar_url TEXT,                      -- 头像
  target_weight DECIMAL(5,1),          -- 目标体重（斤）
  start_weight DECIMAL(5,1),           -- 起始体重（斤）
  height DECIMAL(5,1),                 -- 身高（cm）
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  birth_date DATE,
  reminder_morning TIME DEFAULT '07:00',  -- 早安提醒时间
  reminder_noon TIME DEFAULT '11:30',     -- 午餐提醒时间
  reminder_evening TIME DEFAULT '21:00',  -- 晚间复盘时间
  ai_persona TEXT DEFAULT 'xiaolv',       -- AI人设：xiaolv(小绿) / xiaomei(小美)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 体重记录（核心数据）
CREATE TABLE weight_records (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  weight DECIMAL(5,1) NOT NULL,        -- 体重（斤）
  body_fat DECIMAL(4,1),               -- 体脂率（%）
  note TEXT,                           -- 备注
  recorded_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AI对话会话
CREATE TABLE chat_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT '新对话',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AI对话消息
CREATE TABLE chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 每日打卡（极简版）
CREATE TABLE daily_checkins (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  checkin_date DATE DEFAULT CURRENT_DATE,
  mood SMALLINT CHECK (mood BETWEEN 1 AND 5),   -- 心情1-5
  water_ml INTEGER DEFAULT 0,                    -- 喝水量ml
  exercise_min INTEGER DEFAULT 0,                -- 运动分钟
  note TEXT,                                      -- 一句话日记
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, checkin_date)                  -- 每天只能一条
);

-- ============================================
-- 索引（查询优化）
-- ============================================
CREATE INDEX idx_weight_user_date ON weight_records(user_id, recorded_at DESC);
CREATE INDEX idx_messages_session ON chat_messages(session_id, created_at);
CREATE INDEX idx_checkins_user_date ON daily_checkins(user_id, checkin_date DESC);

-- ============================================
-- RLS策略（行级安全，每个用户只能看自己的数据）
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;

-- profiles: 用户只能读写自己的
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- weight_records: 用户只能读写自己的
CREATE POLICY "Users can manage own weight" ON weight_records
  FOR ALL USING (auth.uid() = user_id);

-- chat_sessions: 用户只能读写自己的
CREATE POLICY "Users can manage own sessions" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- chat_messages: 用户只能读写自己的
CREATE POLICY "Users can manage own messages" ON chat_messages
  FOR ALL USING (auth.uid() = user_id);

-- daily_checkins: 用户只能读写自己的
CREATE POLICY "Users can manage own checkins" ON daily_checkins
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 自动创建profile的触发器
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, phone)
  VALUES (NEW.id, NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- updated_at自动更新函数
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
