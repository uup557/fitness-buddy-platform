import { useLocalStorage, uid, today } from '../hooks/useLocalStorage';
import type { WeightRecord, ExerciseRecord, DietRecord, UserProfile, DailyStats } from '../types';
import { mockUser, mockWeightRecords, mockExerciseRecords, mockDietRecords } from '../data/mockData';

// ─── Seed data (first-launch defaults) ───────────────────────
const SEED_WEIGHT: WeightRecord[] = mockWeightRecords;
const SEED_EXERCISE: ExerciseRecord[] = mockExerciseRecords;
const SEED_DIET: DietRecord[] = mockDietRecords;
const SEED_PROFILE: UserProfile = mockUser;

// ─── Hooks ───────────────────────────────────────────────────

/** User profile (editable) */
export function useProfile() {
  return useLocalStorage<UserProfile>('fb_profile', SEED_PROFILE);
}

/** Weight records — array, newest appended */
export function useWeightRecords() {
  return useLocalStorage<WeightRecord[]>('fb_weight', SEED_WEIGHT);
}

/** Exercise records */
export function useExerciseRecords() {
  return useLocalStorage<ExerciseRecord[]>('fb_exercise', SEED_EXERCISE);
}

/** Diet records */
export function useDietRecords() {
  return useLocalStorage<DietRecord[]>('fb_diet', SEED_DIET);
}

/** Chat history per conversation */
export function useChatHistories() {
  return useLocalStorage<Record<string, { id: string; title: string; createdAt: string }>>('fb_chats', {
    '1': { id: '1', title: '减脂备餐规划', createdAt: today() },
    '2': { id: '2', title: '运动计划建议', createdAt: today() },
    '3': { id: '3', title: '饮食咨询', createdAt: today() },
    '4': { id: '4', title: '新手入门指导', createdAt: today() },
  });
}

// ─── Derived computations ────────────────────────────────────

/** Today's diet records */
export function getTodayDiet(records: DietRecord[]): DietRecord[] {
  const t = today();
  return records.filter(r => r.date === t);
}

/** Today's exercise records */
export function getTodayExercise(records: ExerciseRecord[]): ExerciseRecord[] {
  const t = today();
  return records.filter(r => r.date === t);
}

/** Build DailyStats from today's records */
export function computeDailyStats(
  dietRecords: DietRecord[],
  exerciseRecords: ExerciseRecord[],
): DailyStats {
  const todayDiet = getTodayDiet(dietRecords);
  const todayEx = getTodayExercise(exerciseRecords);

  return {
    date: today(),
    caloriesIntake: todayDiet.reduce((s, r) => s + r.calories, 0),
    caloriesBurned: todayEx.reduce((s, r) => s + r.calories, 0),
    caloriesGoal: 1800,
    steps: 0,          // would come from device sensors
    waterIntake: 0,    // user logs this
    sleepHours: 0,     // user logs this
  };
}

/** Weight chart data from records (last N entries) */
export function buildWeightChartData(records: WeightRecord[], maxPoints = 10) {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const sliced = sorted.slice(-maxPoints);
  return {
    labels: sliced.map(r => {
      const d = new Date(r.date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }),
    weight: sliced.map(r => r.weight),
    bodyFat: sliced.map(r => r.bodyFatRate ?? 0),
  };
}

/** Exercise chart data — group by type */
export function buildExerciseChartData(records: ExerciseRecord[]) {
  const byType: Record<string, number> = {};
  for (const r of records) {
    const label =
      r.type === 'cardio' ? '有氧' :
      r.type === 'strength' ? '力量' :
      r.type === 'yoga' ? '瑜伽' :
      r.type === 'flexibility' ? '柔韧' : r.type;
    byType[label] = (byType[label] || 0) + r.duration;
  }
  return {
    labels: Object.keys(byType),
    minutes: Object.values(byType),
    calories: records.reduce((s, r) => s + r.calories, 0),
  };
}

/** Calories chart — last 7 days */
export function buildCaloriesChartData(
  dietRecords: DietRecord[],
  exerciseRecords: ExerciseRecord[],
) {
  const days: string[] = [];
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const intake = days.map(day =>
    dietRecords.filter(r => r.date === day).reduce((s, r) => s + r.calories, 0)
  );
  const burned = days.map(day =>
    exerciseRecords.filter(r => r.date === day).reduce((s, r) => s + r.calories, 0)
  );
  const labels = days.map(day => {
    const d = new Date(day);
    return dayNames[d.getDay()];
  });

  return { labels, intake, burned };
}

/** Weekly summary */
export function buildWeeklySummary(
  weightRecords: WeightRecord[],
  exerciseRecords: ExerciseRecord[],
  dietRecords: DietRecord[],
) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().slice(0, 10);

  const weekWeight = weightRecords.filter(r => r.date >= weekAgoStr);
  const weekEx = exerciseRecords.filter(r => r.date >= weekAgoStr);
  const weekDiet = dietRecords.filter(r => r.date >= weekAgoStr);

  const sortedWeight = [...weightRecords].sort((a, b) => a.date.localeCompare(b.date));
  const weekStart = sortedWeight.find(r => r.date >= weekAgoStr);
  const weekEnd = sortedWeight[sortedWeight.length - 1];

  return {
    weekStart: weekAgoStr,
    weekEnd: today(),
    avgWeight: weekWeight.length ? weekWeight.reduce((s, r) => s + r.weight, 0) / weekWeight.length : 0,
    weightChange: weekStart && weekEnd ? weekEnd.weight - weekStart.weight : 0,
    avgBodyFat: weekWeight.length ? weekWeight.reduce((s, r) => s + (r.bodyFatRate ?? 0), 0) / weekWeight.length : 0,
    totalExerciseMinutes: weekEx.reduce((s, r) => s + r.duration, 0),
    totalCaloriesBurned: weekEx.reduce((s, r) => s + r.calories, 0),
    totalCaloriesIntake: weekDiet.reduce((s, r) => s + r.calories, 0),
    avgSteps: 0,
  };
}

// ─── Quick add helpers ───────────────────────────────────────

export function addWeightRecord(
  set: (fn: (prev: WeightRecord[]) => WeightRecord[]) => void,
  weight: number,
  bodyFatRate?: number,
) {
  set(prev => [...prev, { date: today(), weight, bodyFatRate }]);
}

export function addExerciseRecord(
  set: (fn: (prev: ExerciseRecord[]) => ExerciseRecord[]) => void,
  data: Omit<ExerciseRecord, 'id' | 'date'>,
) {
  set(prev => [...prev, { ...data, id: uid(), date: today() }]);
}

export function addDietRecord(
  set: (fn: (prev: DietRecord[]) => DietRecord[]) => void,
  data: Omit<DietRecord, 'id' | 'date'>,
) {
  set(prev => [...prev, { ...data, id: uid(), date: today() }]);
}
