import { useState } from 'react';
import { Scale, UtensilsCrossed, Dumbbell, TrendingDown, Flame, Plus, ChevronRight } from 'lucide-react';
import { mockWeightRecords, mockExerciseRecords, mockDietRecords, mockDailyStats } from '../data/mockData';

type RecordTab = 'weight' | 'diet' | 'exercise';

export default function RecordPage() {
  const [activeRecordTab, setActiveRecordTab] = useState<RecordTab>('weight');

  const tabs = [
    { id: 'weight' as const, label: '体重', icon: Scale, color: 'emerald' },
    { id: 'diet' as const, label: '饮食', icon: UtensilsCrossed, color: 'orange' },
    { id: 'exercise' as const, label: '运动', icon: Dumbbell, color: 'blue' },
  ];

  const mealTypeLabels: Record<string, string> = {
    breakfast: '🌅 早餐',
    lunch: '☀️ 午餐',
    dinner: '🌙 晚餐',
    snack: '🍪 加餐',
  };

  const exerciseTypeLabels: Record<string, string> = {
    cardio: '🏃 有氧',
    strength: '💪 力量',
    yoga: '🧘 瑜伽',
    flexibility: '🤸 柔韧',
  };

  const totalCaloriesIn = mockDietRecords.reduce((sum, r) => sum + r.calories, 0);
  const totalCaloriesOut = mockExerciseRecords.reduce((sum, r) => sum + r.calories, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/30 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-bold text-gray-800">📝 记录</h1>
          <p className="text-sm text-gray-500 mt-1">记录你的饮食、运动和体重变化</p>
        </div>

        {/* Today summary */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-orange-50 text-center">
            <Flame className="h-5 w-5 text-orange-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-800">{totalCaloriesIn}</p>
            <p className="text-xs text-gray-500">摄入 kcal</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-emerald-50 text-center">
            <Dumbbell className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-800">{totalCaloriesOut}</p>
            <p className="text-xs text-gray-500">消耗 kcal</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-50 text-center">
            <TrendingDown className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-800">{totalCaloriesOut - totalCaloriesIn}</p>
            <p className="text-xs text-gray-500">赤字 kcal</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-emerald-50/80 rounded-2xl p-1 gap-1 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeRecordTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveRecordTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-emerald-700 shadow-md scale-[1.02]'
                    : 'text-gray-500 hover:text-emerald-600 hover:bg-white/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Weight records */}
        {activeRecordTab === 'weight' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">体重记录</h2>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-200">
                <Plus className="h-4 w-4" />
                记录体重
              </button>
            </div>

            {/* Mini chart */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-emerald-50">
              <div className="flex items-end justify-around h-40 mb-4">
                {mockWeightRecords.map((record) => {
                  const max = Math.max(...mockWeightRecords.map(r => r.weight)) + 1;
                  const min = Math.min(...mockWeightRecords.map(r => r.weight)) - 1;
                  const range = max - min;
                  const h = ((record.weight - min) / range) * 100;
                  return (
                    <div key={record.date} className="flex flex-col items-center gap-1.5">
                      <span className="text-xs font-bold text-emerald-700">{record.weight}kg</span>
                      <div className="w-10 h-28 flex items-end">
                        <div
                          className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all duration-700"
                          style={{ height: `${Math.max(h, 10)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{record.date.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* History list */}
            <div className="bg-white rounded-2xl shadow-md border border-emerald-50 overflow-hidden">
              {mockWeightRecords.slice().reverse().map((record, i, arr) => (
                <div
                  key={record.date}
                  className={`flex items-center justify-between p-4 ${
                    i > 0 ? 'border-t border-gray-50' : ''
                  } hover:bg-emerald-50/30 transition-colors`}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{record.date}</p>
                    <p className="text-xs text-gray-500">体脂率: {record.bodyFatRate}%</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-emerald-700">{record.weight}kg</span>
                    {i > 0 && (
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        record.weight < arr[i - 1].weight
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-orange-50 text-orange-600'
                      }`}>
                        {record.weight < arr[i - 1].weight ? '↓' : '↑'}
                        {Math.abs(record.weight - arr[i - 1].weight).toFixed(1)}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diet records */}
        {activeRecordTab === 'diet' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">今日饮食</h2>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-md shadow-orange-200">
                <Plus className="h-4 w-4" />
                记录饮食
              </button>
            </div>

            {/* Daily intake bar */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-orange-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">今日热量摄入</span>
                <span className="text-sm font-bold text-orange-600">{totalCaloriesIn} / {mockDailyStats.caloriesGoal} kcal</span>
              </div>
              <div className="w-full bg-orange-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-400 to-amber-400 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((totalCaloriesIn / mockDailyStats.caloriesGoal) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>蛋白质: {mockDietRecords.reduce((s, r) => s + r.protein, 0)}g</span>
                <span>碳水: {mockDietRecords.reduce((s, r) => s + r.carbs, 0)}g</span>
                <span>脂肪: {mockDietRecords.reduce((s, r) => s + r.fat, 0)}g</span>
              </div>
            </div>

            {/* Meal cards */}
            {mockDietRecords.map((record) => (
              <div key={record.id} className="bg-white rounded-2xl p-4 shadow-md border border-orange-50 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-800">{mealTypeLabels[record.mealType] || record.mealType}</span>
                  <span className="text-sm font-bold text-orange-600">{record.calories} kcal</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{record.food}</p>
                <div className="flex gap-3">
                  <span className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">蛋白 {record.protein}g</span>
                  <span className="text-xs bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full">碳水 {record.carbs}g</span>
                  <span className="text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full">脂肪 {record.fat}g</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Exercise records */}
        {activeRecordTab === 'exercise' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">运动记录</h2>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-200">
                <Plus className="h-4 w-4" />
                记录运动
              </button>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">本周运动</p>
                  <p className="text-3xl font-bold text-gray-800">{mockExerciseRecords.reduce((s, r) => s + r.duration, 0)}分钟</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">消耗热量</p>
                  <p className="text-3xl font-bold text-blue-600">{mockExerciseRecords.reduce((s, r) => s + r.calories, 0)}</p>
                  <p className="text-xs text-gray-400">kcal</p>
                </div>
              </div>
            </div>

            {/* Exercise list */}
            {mockExerciseRecords.map((record) => (
              <div key={record.id} className="bg-white rounded-2xl p-4 shadow-md border border-blue-50 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg">
                      {exerciseTypeLabels[record.type]?.split(' ')[0] || '🏋️'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{record.description}</p>
                      <p className="text-xs text-gray-500">{record.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">{record.calories} kcal</p>
                    <p className="text-xs text-gray-500">{record.duration}分钟</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
