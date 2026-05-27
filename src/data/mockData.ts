import type { Message, UserProfile, WeightRecord, ExerciseRecord, DietRecord, DailyStats, WeeklyReport } from '../types';

export const mockUser: UserProfile = {
  id: '1',
  name: '小明',
  avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=young%20man%20portrait%20avatar%20professional&image_size=square',
  age: 28,
  height: 175,
  weight: 75,
  targetWeight: 68,
  bodyFatRate: 22.5,
  goal: 'lose_weight',
  activityLevel: 'moderate',
  startDate: '2024-01-01'
};

export const mockMessages: Message[] = [
  {
    id: '1',
    content: '嗨！我是你的 AI 减脂教练，很高兴为你服务！请问今天有什么可以帮到你的？',
    sender: 'ai',
    timestamp: '2024-05-27 08:00',
    type: 'text'
  },
  {
    id: '2',
    content: '你好！我想咨询一下减脂计划',
    sender: 'user',
    timestamp: '2024-05-27 08:05',
    type: 'text'
  },
  {
    id: '3',
    content: '太棒了！制定减脂计划需要了解一些基本信息。请问你的年龄、身高、体重是多少？还有你的运动习惯怎么样呢？',
    sender: 'ai',
    timestamp: '2024-05-27 08:06',
    type: 'text'
  },
  {
    id: '4',
    content: '我今年28岁，身高175cm，体重75kg，平时每周运动3次左右',
    sender: 'user',
    timestamp: '2024-05-27 08:10',
    type: 'text'
  },
  {
    id: '5',
    content: '好的，根据你的信息，我来为你制定一份个性化的减脂计划：\n\n**饮食建议：**\n- 每日摄入约1800-2000卡路里\n- 蛋白质：每公斤体重1.2-1.5g\n- 碳水：选糙米、燕麦等优质碳水\n\n**运动建议：**\n- 有氧运动：每周3-4次，每次30-45分钟\n- 力量训练：每周2-3次，可在家或健身房\n\n**生活习惯：**\n- 保证7-8小时睡眠\n- 每天喝2-3升水\n\n需要我帮你详细解释哪一部分吗？',
    sender: 'ai',
    timestamp: '2024-05-27 08:12',
    type: 'text'
  },
  {
    id: '6',
    content: '可以详细说说饮食方面吗？',
    sender: 'user',
    timestamp: '2024-05-27 08:15',
    type: 'text'
  },
  {
    id: '7',
    content: '当然可以！饮食是减脂的核心，我来给你详细的饮食建议：\n\n**早餐（300-400卡路里）：**\n- 鸡蛋2个 + 全麦面包2片 + 牛奶200ml\n- 或 燕麦50g + 牛奶 + 水果\n\n**午餐（400-500卡路里）：**\n- 主食：糙米/藜麦半碗\n- 蛋白质：鸡胸肉/鱼/豆腐150g\n- 蔬菜：大量绿叶蔬菜\n\n**晚餐（300-400卡路里）：**\n- 清淡为主，减少碳水\n- 可以多吃蔬菜和蛋白质\n\n**加餐：**\n- 水果、坚果、无糖酸奶\n\n记得多喝水，饭前喝一杯有助于增加饱腹感哦！',
    sender: 'ai',
    timestamp: '2024-05-27 08:18',
    type: 'text'
  }
];

export const mockWeightRecords: WeightRecord[] = [
  { date: '2024-05-01', weight: 78.5, bodyFatRate: 24.2 },
  { date: '2024-05-08', weight: 77.8, bodyFatRate: 23.8 },
  { date: '2024-05-15', weight: 77.2, bodyFatRate: 23.5 },
  { date: '2024-05-22', weight: 76.5, bodyFatRate: 22.8 },
  { date: '2024-05-27', weight: 75.0, bodyFatRate: 22.5 }
];

export const mockExerciseRecords: ExerciseRecord[] = [
  { id: '1', date: '2024-05-27', type: 'cardio', duration: 45, calories: 350, description: '跑步5公里' },
  { id: '2', date: '2024-05-26', type: 'strength', duration: 60, calories: 280, description: '力量训练' },
  { id: '3', date: '2024-05-25', type: 'cardio', duration: 30, calories: 220, description: '骑行' },
  { id: '4', date: '2024-05-24', type: 'yoga', duration: 45, calories: 180, description: '瑜伽练习' },
  { id: '5', date: '2024-05-23', type: 'cardio', duration: 40, calories: 300, description: '游泳' }
];

export const mockDietRecords: DietRecord[] = [
  { id: '1', date: '2024-05-27', mealType: 'breakfast', calories: 350, protein: 25, carbs: 40, fat: 12, food: '鸡蛋2个、全麦面包2片、牛奶200ml' },
  { id: '2', date: '2024-05-27', mealType: 'lunch', calories: 450, protein: 35, carbs: 50, fat: 15, food: '糙米饭、鸡胸肉、西兰花' },
  { id: '3', date: '2024-05-27', mealType: 'dinner', calories: 320, protein: 28, carbs: 25, fat: 10, food: '清蒸鱼、蔬菜沙拉' }
];

export const mockDailyStats: DailyStats = {
  date: '2024-05-27',
  caloriesIntake: 1120,
  caloriesBurned: 2400,
  caloriesGoal: 1800,
  steps: 8500,
  waterIntake: 2200,
  sleepHours: 7.5
};

export const mockWeeklyReport: WeeklyReport = {
  weekStart: '2024-05-20',
  weekEnd: '2024-05-27',
  avgWeight: 76.2,
  weightChange: -1.5,
  avgBodyFat: 22.7,
  totalExerciseMinutes: 220,
  totalCaloriesBurned: 1550,
  totalCaloriesIntake: 12600,
  avgSteps: 7800
};

export const weightChartData = {
  labels: ['5/1', '5/8', '5/15', '5/22', '5/27'],
  weight: [78.5, 77.8, 77.2, 76.5, 75.0],
  bodyFat: [24.2, 23.8, 23.5, 22.8, 22.5]
};

export const caloriesChartData = {
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  intake: [1850, 1720, 1900, 1680, 1800, 2000, 1120],
  burned: [2200, 2400, 2100, 2500, 2300, 2600, 2400]
};

export const exerciseChartData = {
  labels: ['跑步', '力量', '骑行', '瑜伽', '游泳'],
  minutes: [90, 120, 60, 45, 40],
  calories: [680, 560, 440, 360, 300]
};
