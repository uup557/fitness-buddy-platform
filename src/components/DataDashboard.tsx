import { TrendingDown, Flame, Droplets, Footprints, Moon, Target, Award, Activity, Heart, Sparkles, Trophy } from 'lucide-react';
import {
  mockUser,
  mockDailyStats,
  mockWeeklyReport,
  weightChartData,
  caloriesChartData,
  exerciseChartData,
} from '../data/mockData';

export default function DataDashboard() {
  const progressPercent = ((mockUser.weight - mockUser.targetWeight) / (mockUser.weight - (mockUser.weight * 0.9))) * 100;

  const renderWeightChart = () => {
    const maxWeight = Math.max(...weightChartData.weight) + 2;
    const minWeight = Math.min(...weightChartData.weight) - 2;
    const range = maxWeight - minWeight;

    return (
      <div className="space-y-4">
        {weightChartData.labels.map((label, index) => {
          const heightPercent = ((weightChartData.weight[index] - minWeight) / range) * 60 + 20;
          return (
            <div key={label} className="flex items-center gap-4">
              <span className="w-10 text-sm text-gray-600 font-medium">{label}</span>
              <div className="flex-1 h-10 flex items-end justify-center">
                <div
                  className="w-8 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all duration-700 hover:from-emerald-600 hover:to-teal-500 cursor-pointer shadow-sm hover:shadow-md"
                  style={{ height: `${heightPercent}%`, animationDelay: `${index * 100}ms` }}
                />
              </div>
              <span className="w-14 text-sm font-bold text-emerald-700">
                {weightChartData.weight[index]}kg
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCaloriesChart = () => {
    const maxValue = Math.max(...caloriesChartData.intake, ...caloriesChartData.burned) + 200;

    return (
      <div className="space-y-4">
        {caloriesChartData.labels.map((label, index) => {
          const intakeWidth = (caloriesChartData.intake[index] / maxValue) * 100;
          const burnedWidth = (caloriesChartData.burned[index] / maxValue) * 100;
          const balance = caloriesChartData.burned[index] - caloriesChartData.intake[index];
          return (
            <div key={label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">{label}</span>
                <span className={`font-bold ${balance > 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
                  {balance > 0 ? '+' : ''}{balance} kcal
                </span>
              </div>
              <div className="h-5 bg-emerald-50 rounded-full overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 rounded-full"
                  style={{ width: `${intakeWidth}%` }}
                />
                <div
                  className="bg-gradient-to-r from-emerald-300 to-teal-200 transition-all duration-700 rounded-full"
                  style={{ width: `${burnedWidth > intakeWidth ? burnedWidth - intakeWidth : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderExerciseChart = () => {
    const maxMinutes = Math.max(...exerciseChartData.minutes);

    return (
      <div className="flex justify-around items-end h-36">
        {exerciseChartData.labels.map((label, index) => {
          const heightPercent = (exerciseChartData.minutes[index] / maxMinutes) * 100;
          return (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="flex items-end justify-center h-28 w-12">
                <div
                  className="w-10 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-xl transition-all duration-700 hover:from-emerald-600 hover:to-teal-500 cursor-pointer shadow-sm hover:shadow-md"
                  style={{ height: `${heightPercent}%`, animationDelay: `${index * 100}ms` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 text-center">{label}</span>
              <span className="text-xs font-bold text-emerald-600">
                {exerciseChartData.minutes[index]}min
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/30 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 顶部体重卡片 */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-200/50 animate-fade-in-up overflow-hidden relative">
          {/* 装饰性背景元素 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <Target className="h-6 w-6" />
                </div>
                <span className="text-lg font-medium opacity-95">当前体重</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl lg:text-7xl font-bold animate-count">{mockUser.weight}</span>
                <span className="text-3xl lg:text-4xl opacity-90">kg</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <TrendingDown className="h-4 w-4 text-emerald-200" />
                  <span className="text-sm">目标: <span className="font-bold">{mockUser.targetWeight}kg</span></span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <Activity className="h-4 w-4 text-emerald-200" />
                  <span className="text-sm">体脂率: <span className="font-bold">{mockUser.bodyFatRate}%</span></span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto text-center lg:text-right">
              <div className="text-sm opacity-90 mb-3">减脂进度</div>
              <div className="w-full lg:w-64 h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000 shadow-lg animate-progress"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-center lg:justify-end gap-2">
                <Heart className="h-4 w-4 text-pink-300" />
                <span className="text-lg font-bold">已减 {mockUser.weight - mockUser.targetWeight}kg 🎉</span>
              </div>
            </div>
          </div>
        </div>

        {/* 数据卡片网格 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md shadow-orange-100/50 border border-orange-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-fade-in-up">
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-3 rounded-2xl w-fit mb-3">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">今日消耗</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{mockDailyStats.caloriesBurned}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
              <TrendingDown className="h-3 w-3" /> +12% vs 昨日
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md shadow-blue-100/50 border border-blue-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-3 rounded-2xl w-fit mb-3">
              <Droplets className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">今日饮水</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{mockDailyStats.waterIntake}ml</p>
            <div className="mt-3 w-full bg-blue-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full animate-progress"
                style={{ width: `${(mockDailyStats.waterIntake / 3000) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md shadow-emerald-100/50 border border-emerald-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-3 rounded-2xl w-fit mb-3">
              <Footprints className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">今日步数</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{mockDailyStats.steps.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
              <Target className="h-3 w-3" /> 目标: 10,000步
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md shadow-purple-100/50 border border-purple-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-2xl w-fit mb-3">
              <Moon className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">睡眠时长</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{mockDailyStats.sleepHours}h</p>
            <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> 达标 ✓
            </p>
          </div>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">体重变化趋势</h3>
              <div className="p-2 bg-emerald-50 rounded-xl">
                <TrendingDown className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            {renderWeightChart()}
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">本周卡路里收支</h3>
              <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs font-semibold text-emerald-700">盈余</span>
              </div>
            </div>
            {renderCaloriesChart()}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-emerald-50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                <span className="text-xs text-gray-600">摄入</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-300 to-teal-200 rounded-full" />
                <span className="text-xs text-gray-600">消耗</span>
              </div>
            </div>
          </div>
        </div>

        {/* 运动统计 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-50 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">运动时长统计</h3>
              <p className="text-xs text-gray-500 mt-1">本周运动记录</p>
            </div>
            <div className="flex items-center gap-2 text-sm bg-emerald-50 px-3 py-1.5 rounded-full">
              <Activity className="h-4 w-4 text-emerald-500" />
              <span className="font-semibold text-emerald-700">总计 {mockWeeklyReport.totalExerciseMinutes}分钟</span>
            </div>
          </div>
          {renderExerciseChart()}
        </div>

        {/* 本周报告 + 成就徽章 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-50 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-2xl shadow-sm shadow-emerald-200">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">本周报告</h3>
                <p className="text-xs text-gray-500">每周总结</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">2024-05-20 ~ 2024-05-27</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100 text-center hover:shadow-md transition-all duration-300">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-2">
                {mockWeeklyReport.weightChange.toFixed(1)}kg
              </div>
              <p className="text-xs text-gray-500 mb-2">本周减重</p>
              <div className="flex items-center justify-center gap-1">
                <TrendingDown className="h-3 w-3 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600">继续保持!</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100 text-center hover:shadow-md transition-all duration-300">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                {mockWeeklyReport.totalExerciseMinutes}
              </div>
              <p className="text-xs text-gray-500 mb-2">运动分钟</p>
              <div className="flex items-center justify-center gap-1">
                <Activity className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-semibold text-blue-600">活力满满</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100 text-center hover:shadow-md transition-all duration-300">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">
                {mockWeeklyReport.totalCaloriesBurned}
              </div>
              <p className="text-xs text-gray-500 mb-2">消耗卡路里</p>
              <div className="flex items-center justify-center gap-1">
                <Flame className="h-3 w-3 text-orange-500" />
                <span className="text-xs font-semibold text-orange-600">燃烧卡路里</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100 text-center hover:shadow-md transition-all duration-300">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                {mockWeeklyReport.avgSteps.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mb-2">平均步数</p>
              <div className="flex items-center justify-center gap-1">
                <Footprints className="h-3 w-3 text-purple-500" />
                <span className="text-xs font-semibold text-purple-600">步数达标</span>
              </div>
            </div>
          </div>

          {/* 成就徽章区域 */}
          <div className="mt-6 pt-5 border-t border-emerald-100">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-bold text-gray-700">本周成就</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-full px-3 py-1.5">
                <span className="text-base">🏆</span>
                <span className="text-xs font-semibold text-amber-700">坚持7天打卡</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-full px-3 py-1.5">
                <span className="text-base">🔥</span>
                <span className="text-xs font-semibold text-emerald-700">连续运动5天</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-full px-3 py-1.5">
                <span className="text-base">💧</span>
                <span className="text-xs font-semibold text-blue-700">饮水达标</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-full px-3 py-1.5">
                <span className="text-base">⚡</span>
                <span className="text-xs font-semibold text-purple-700">减重1.5kg</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-full px-3 py-1.5">
                <span className="text-base">🌟</span>
                <span className="text-xs font-semibold text-pink-700">AI伙伴好评</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
