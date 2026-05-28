import { ClipboardList, MessageCircle, TrendingDown, Flame, Dumbbell, Calendar } from 'lucide-react';
import { mockWeightRecords, mockDietRecords, mockExerciseRecords } from '../data/mockData';

interface RecordPageProps {
  onNavigateToChat?: () => void;
}

export default function RecordPage({ onNavigateToChat }: RecordPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/30 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 顶部提示 */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 text-white shadow-xl shadow-emerald-200/50 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">记录你的成长</h2>
              <p className="text-sm opacity-90 mt-1">告诉小绿你的饮食、运动和体重，TA会帮你记录分析</p>
            </div>
          </div>
          <button
            onClick={onNavigateToChat}
            className="mt-4 w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            开始记录 →
          </button>
        </div>

        {/* 体重记录 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-50 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-xl">
                <TrendingDown className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">体重记录</h3>
            </div>
            <span className="text-xs text-gray-400">最近7条</span>
          </div>
          <div className="space-y-3">
            {mockWeightRecords.slice(0, 7).map((record, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-emerald-50 last:border-0">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{record.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-emerald-700">{record.weight}kg</span>
                  {record.bodyFatRate && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      体脂 {record.bodyFatRate}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 饮食记录 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-50 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-xl">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">饮食记录</h3>
            </div>
            <span className="text-xs text-gray-400">最近5条</span>
          </div>
          <div className="space-y-3">
            {mockDietRecords.slice(0, 5).map((record, index) => (
              <div key={index} className="py-3 border-b border-emerald-50 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">{record.mealType === 'breakfast' ? '🌅 早餐' : record.mealType === 'lunch' ? '☀️ 午餐' : record.mealType === 'dinner' ? '🌙 晚餐' : '🍪 加餐'}</span>
                    <span className="text-xs text-gray-400">{record.date}</span>
                  </div>
                  <span className="text-sm font-bold text-orange-600">{record.calories}kcal</span>
                </div>
                <p className="text-sm text-gray-600">{record.food}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs text-gray-500">蛋白质 {record.protein}g</span>
                  <span className="text-xs text-gray-500">碳水 {record.carbs}g</span>
                  <span className="text-xs text-gray-500">脂肪 {record.fat}g</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 运动记录 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-50 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <Dumbbell className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">运动记录</h3>
            </div>
            <span className="text-xs text-gray-400">最近5条</span>
          </div>
          <div className="space-y-3">
            {mockExerciseRecords.slice(0, 5).map((record, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-emerald-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{record.type}</p>
                    <p className="text-xs text-gray-400">{record.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">{record.duration}分钟</p>
                  <p className="text-xs text-gray-500">消耗 {record.calories}kcal</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
