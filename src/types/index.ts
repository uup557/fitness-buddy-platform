export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  type: 'text' | 'image' | 'system';
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  bodyFatRate: number;
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  startDate: string;
}

export interface WeightRecord {
  date: string;
  weight: number;
  bodyFatRate?: number;
  muscleMass?: number;
  waterRate?: number;
}

export interface ExerciseRecord {
  id: string;
  date: string;
  type: 'cardio' | 'strength' | 'yoga' | 'flexibility';
  duration: number;
  calories: number;
  description: string;
}

export interface DietRecord {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  food: string;
}

export interface DailyStats {
  date: string;
  caloriesIntake: number;
  caloriesBurned: number;
  caloriesGoal: number;
  steps: number;
  waterIntake: number;
  sleepHours: number;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  avgWeight: number;
  weightChange: number;
  avgBodyFat: number;
  totalExerciseMinutes: number;
  totalCaloriesBurned: number;
  totalCaloriesIntake: number;
  avgSteps: number;
}
