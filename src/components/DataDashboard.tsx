import { TrendingDown, Flame, Droplets, Footprints, Moon, Target, Award, Activity, Heart } from 'lucide-react';
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
      <div className="space-y-5">
        {weightChartData.labels.map((label, index) => {
          const heightPercent = ((weightChartData.weight[index] - minWeight) / range) * 60 + 20;
          return (
            <div key={label} className="flex items-center gap-5">
              <span className="w-12 text-sm text-gray-600 font-medium">{label}</span>
              <div className="flex-1 h-12 flex items-end justify-center">
                <div
                  className="w-10 bg-indigo-600 rounded-t-lg transition-all duration-500 hover:bg-indigo-700 cursor-pointer"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="w-16 text-sm font-bold text-gray-800">
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
      <div className="space-y-5">
        {caloriesChartData.labels.map((label, index) => {
          const intakeWidth = (caloriesChartData.intake[index] / maxValue) * 100;
          const burnedWidth = (caloriesChartData.burned[index] / maxValue) * 100;
          const balance = caloriesChartData.burned[index] - caloriesChartData.intake[index];
          return (
            <div key={label} className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">{label}</span>
                <span className={`font-bold ${balance > 0 ? 'text-indigo-600' : 'text-orange-500'}`}>
                  {balance > 0 ? '+' : ''}{balance} kcal
                </span>
              </div>
              <div className="h-6 bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-indigo-600 transition-all duration-500"
                  style={{ width: `${intakeWidth}%` }}
                />
                <div
                  className="bg-indigo-400 transition-all duration-500"
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
      <div className="flex justify-around items-end h-40">
        {exerciseChartData.labels.map((label, index) => {
          const heightPercent = (exerciseChartData.minutes[index] / maxMinutes) * 100;
          return (
            <div key={label} className="flex flex-col items-center gap-3">
              <div className="flex items-end justify-center h-32 w-14">
                <div
                  className="w-12 bg-indigo-600 rounded-t-lg transition-all duration-500 hover:bg-indigo-700 cursor-pointer"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">{label}</span>
              <span className="text-sm font-bold text-indigo-600">
                {exerciseChartData.minutes[index]}min
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-indigo-600 rounded-3xl p-10 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-2xl">
                  <Target className="h-8 w-8" aria-hidden="true" />
                </div>
                <span className="text-2xl font-medium opacity-95">当前体重</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-7xl lg:text-8xl font-bold">{mockUser.weight}</span>
                <span className="text-4xl lg:text-5xl opacity-90">kg</span>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-6 w-6 text-indigo-200" aria-hidden="true" />
                  <span className="text-lg">目标: <span className="font-bold">{mockUser.targetWeight}kg</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-indigo-200" aria-hidden="true" />
                  <span className="text-lg">体脂率: <span className="font-bold">{mockUser.bodyFatRate}%</span></span>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-auto text-center lg:text-right">
              <div className="text-lg opacity-90 mb-5">减脂进度</div>
              <div className="w-full lg:w-80 h-6 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000 shadow-lg"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
              <div className="mt-5 flex items-center justify-center lg:justify-end gap-3">
                <Heart className="h-6 w-6 text-pink-300" aria-hidden="true" />
                <span className="text-xl font-bold">已减 {mockUser.weight - mockUser.targetWeight}kg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-orange-100 p-4 rounded-2xl">
                <Flame className="h-8 w-8 text-orange-600" aria-hidden="true" />
              </div>
            </div>
            <div>
              <p className="text-base text-gray-500 mb-2">今日消耗</p>
              <p className="text-4xl font-bold text-gray-900">{mockDailyStats.caloriesBurned}</p>
              <p className="text-base text-indigo-600 font-semibold mt-3">+12% vs 昨日</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-blue-100 p-4 rounded-2xl">
                <Droplets className="h-8 w-8 text-blue-600" aria-hidden="true" />
              </div>
            </div>
            <div>
              <p className="text-base text-gray-500 mb-2">今日饮水</p>
              <p className="text-4xl font-bold text-gray-900">{mockDailyStats.waterIntake}ml</p>
              <div className="mt-4 w-full bg-blue-100 rounded-full h-4">
                <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${(mockDailyStats.waterIntake / 3000) * 100}%` }} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-green-100 p-4 rounded-2xl">
                <Footprints className="h-8 w-8 text-green-600" aria-hidden="true" />
              </div>
            </div>
            <div>
              <p className="text-base text-gray-500 mb-2">今日步数</p>
              <p className="text-4xl font-bold text-gray-900">{mockDailyStats.steps.toLocaleString()}</p>
              <p className="text-base text-indigo-600 font-semibold mt-3">目标: 10,000步</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-purple-100 p-4 rounded-2xl">
                <Moon className="h-8 w-8 text-purple-600" aria-hidden="true" />
              </div>
            </div>
            <div>
              <p className="text-base text-gray-500 mb-2">睡眠时长</p>
              <p className="text-4xl font-bold text-gray-900">{mockDailyStats.sleepHours}h</p>
              <p className="text-base text-indigo-600 font-semibold mt-3">达标 ✓</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">体重变化趋势</h3>
              <TrendingDown className="h-7 w-7 text-indigo-600" aria-hidden="true" />
            </div>
            {renderWeightChart()}
            <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-indigo-600 rounded-lg" />
                <span className="text-base text-gray-600">体重</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">本周卡路里收支</h3>
              <div className="flex items-center gap-2 bg-indigo-50 px-5 py-2 rounded-full">
                <span className="w-3 h-3 bg-indigo-600 rounded-full" />
                <span className="text-base font-semibold text-indigo-700">盈余</span>
              </div>
            </div>
            {renderCaloriesChart()}
            <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-indigo-600 rounded-lg" />
                <span className="text-base text-gray-600">摄入</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-indigo-400 rounded-lg" />
                <span className="text-base text-gray-600">消耗</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">运动时长统计</h3>
              <p className="text-base text-gray-500 mt-2">本周运动记录</p>
            </div>
            <div className="flex items-center gap-3 text-lg text-gray-700">
              <Activity className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              <span className="font-semibold">总计 {mockWeeklyReport.totalExerciseMinutes}分钟</span>
            </div>
          </div>
          {renderExerciseChart()}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-4 rounded-2xl">
                <Award className="h-7 w-7 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">本周报告</h3>
                <p className="text-base text-gray-500">每周总结</p>
              </div>
            </div>
            <span className="text-base text-gray-400">2024-05-20 ~ 2024-05-27</span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-3">
                {mockWeeklyReport.weightChange.toFixed(1)}kg
              </div>
              <p className="text-base text-gray-500">本周减重</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <TrendingDown className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                <span className="text-base font-semibold text-indigo-600">继续保持!</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-3">
                {mockWeeklyReport.totalExerciseMinutes}
              </div>
              <p className="text-base text-gray-500">运动分钟</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                <span className="text-base font-semibold text-indigo-600">活力满满</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
              <div className="text-4xl font-bold text-orange-600 mb-3">
                {mockWeeklyReport.totalCaloriesBurned}
              </div>
              <p className="text-base text-gray-500">消耗卡路里</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" aria-hidden="true" />
                <span className="text-base font-semibold text-orange-600">燃烧卡路里</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-3">
                {mockWeeklyReport.avgSteps.toLocaleString()}
              </div>
              <p className="text-base text-gray-500">平均步数</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Footprints className="h-5 w-5 text-blue-500" aria-hidden="true" />
                <span className="text-base font-semibold text-blue-600">步数达标</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}