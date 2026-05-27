import type { User, Activity, CommunityPost, WorkoutPlan } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: '运动达人小王',
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fitness%20man%20portrait%20avatar%20professional&image_size=square',
    bio: '热爱跑步和健身，每周坚持5次训练',
    level: '高级',
    fitnessGoals: ['减脂', '增肌', '马拉松'],
    location: '北京',
    joinDate: '2024-01-15'
  },
  {
    id: '2',
    name: '瑜伽女神Lisa',
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=young%20woman%20yoga%20instructor%20portrait&image_size=square',
    bio: '专业瑜伽教练，专注于身心平衡',
    level: '专家',
    fitnessGoals: ['柔韧性', '冥想', '健康生活'],
    location: '上海',
    joinDate: '2023-06-20'
  },
  {
    id: '3',
    name: '力量训练者Mike',
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=muscular%20man%20gym%20portrait%20professional&image_size=square',
    bio: '健身爱好者，擅长力量训练',
    level: '高级',
    fitnessGoals: ['增肌', '力量提升', '体能训练'],
    location: '深圳',
    joinDate: '2024-03-10'
  },
  {
    id: '4',
    name: '跑步爱好者小陈',
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=runner%20athlete%20portrait%20energetic&image_size=square',
    bio: '马拉松爱好者，已经完成3场全马',
    level: '中级',
    fitnessGoals: ['跑步', '马拉松', '耐力提升'],
    location: '广州',
    joinDate: '2024-02-28'
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    title: '周末晨跑约起来',
    description: '每周六早上7点，奥林匹克森林公园约跑，距离5-10公里，欢迎新手加入',
    type: 'running',
    date: '2024-06-01',
    time: '07:00',
    location: '奥林匹克森林公园',
    maxParticipants: 15,
    currentParticipants: 8,
    organizer: mockUsers[0],
    participants: [mockUsers[0], mockUsers[3]],
    tags: ['跑步', '有氧运动', '新手友好']
  },
  {
    id: '2',
    title: '瑜伽冥想工作坊',
    description: '每周日上午9点，专业瑜伽教练带领，适合所有水平学员',
    type: 'yoga',
    date: '2024-06-02',
    time: '09:00',
    location: '静瑜伽工作室',
    maxParticipants: 10,
    currentParticipants: 6,
    organizer: mockUsers[1],
    participants: [mockUsers[1]],
    tags: ['瑜伽', '冥想', '放松']
  },
  {
    id: '3',
    title: '力量训练小组课',
    description: '每周二、四晚上，一起在健身房训练，互相监督进步',
    type: 'gym',
    date: '2024-06-04',
    time: '19:00',
    location: '力量健身俱乐部',
    maxParticipants: 8,
    currentParticipants: 5,
    organizer: mockUsers[2],
    participants: [mockUsers[2], mockUsers[0]],
    tags: ['力量训练', '增肌', '健身房']
  },
  {
    id: '4',
    title: '城市骑行探索',
    description: '探索城市周边骑行路线，全程约30公里',
    type: 'cycling',
    date: '2024-06-08',
    time: '08:30',
    location: '朝阳公园南门',
    maxParticipants: 12,
    currentParticipants: 7,
    organizer: mockUsers[3],
    participants: [mockUsers[3]],
    tags: ['骑行', '户外活动', '城市探索']
  }
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1',
    author: mockUsers[0],
    content: '今天完成了10公里晨跑，感觉状态很好！有没有一起打卡的小伙伴？',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=morning%20jogging%20sunrise%20park&image_size=landscape_16_9',
    likes: 42,
    comments: 8,
    createdAt: '2024-05-27 08:30'
  },
  {
    id: '2',
    author: mockUsers[1],
    content: '分享一个简单的办公室瑜伽拉伸动作，久坐的朋友们可以试试！',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=yoga%20stretching%20office%20workspace&image_size=landscape_16_9',
    likes: 67,
    comments: 15,
    createdAt: '2024-05-27 10:15'
  },
  {
    id: '3',
    author: mockUsers[2],
    content: '今天练了深蹲和硬拉，腿部力量又进步了！附上训练计划供大家参考',
    likes: 35,
    comments: 12,
    createdAt: '2024-05-26 18:45'
  }
];

export const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    title: '初学者全身训练计划',
    description: '适合健身新手的全身训练，每周3次，循序渐进',
    duration: 45,
    level: 'beginner',
    exercises: [
      { id: '1', name: '徒手深蹲', sets: 3, reps: 15, rest: 60, description: '保持背部挺直，膝盖不超过脚尖' },
      { id: '2', name: '俯卧撑', sets: 3, reps: 10, rest: 60, description: '核心收紧，身体成一条直线' },
      { id: '3', name: '平板支撑', sets: 3, reps: 30, rest: 45, description: '保持身体稳定，不要塌腰' },
      { id: '4', name: '臀桥', sets: 3, reps: 15, rest: 60, description: '臀部发力，挤压顶峰' }
    ],
    createdBy: mockUsers[2]
  },
  {
    id: '2',
    title: 'HIIT燃脂训练',
    description: '高强度间歇训练，快速燃烧卡路里',
    duration: 30,
    level: 'intermediate',
    exercises: [
      { id: '1', name: '开合跳', sets: 4, reps: 40, rest: 30, description: '快速开合，保持心率' },
      { id: '2', name: '波比跳', sets: 4, reps: 15, rest: 30, description: '全身运动，爆发力训练' },
      { id: '3', name: '高抬腿', sets: 4, reps: 30, rest: 30, description: '快速抬腿，保持节奏' },
      { id: '4', name: '登山者', sets: 4, reps: 40, rest: 30, description: '核心收紧，快速交替' }
    ],
    createdBy: mockUsers[0]
  }
];
