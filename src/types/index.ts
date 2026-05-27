export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  level: string;
  fitnessGoals: string[];
  location: string;
  joinDate: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'running' | 'gym' | 'yoga' | 'cycling' | 'swimming' | 'hiking' | 'team_sport';
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  organizer: User;
  participants: User[];
  tags: string[];
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ChatRoom {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  createdBy: User;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
  description: string;
}

export interface CommunityPost {
  id: string;
  author: User;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: string;
}
