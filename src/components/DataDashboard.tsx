import { TrendingDown, TrendingUp, Flame, Droplets, Footprints, Moon } from 'lucide-react';
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
      <div className="space-y-3">
        {weightChartData.labels.map((label, index) => {
          const heightPercent = ((weightChartData.weight[index] - minWeight) / range) * 60 + 20;
          return (
            <div key={label} className="flex items-center space-x-3">
              <span className="w-8 text-xs text-gray-500">{label}</span>
              <div className="flex-1 h-8 flex items-end justify-center">
                <div
                  className="w-6 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="w-12 text-xs font-medium text-gray-700">{weightChartData.weight[index]}kg</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCaloriesChart = () => {
    const maxValue = Math.max(...caloriesChartData.intake, ...caloriesChartData.burned) + 200;

    return (
      <div className="space-y-2">
        {caloriesChartData.labels.map((label, index) => {
          const intakeWidth = (caloriesChartData.intake[index] / maxValue) * 100;
          const burnedWidth = (caloriesChartData.burned[index] / maxValue) * 100;
          return (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-600">
                  {caloriesChartData.burned[index] - caloriesChartData.intake[index] > 0 ? '+' : ''}
                  {caloriesChartData.burned[index] - caloriesChartData.intake[index]} kcal
                </span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-orange-400 transition-all duration-500"
                  style={{ width: `${intakeWidth}%` }}
                />
                <div
                  className="bg-emerald-500 transition-all duration-500"
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
      <div className="flex justify-around items-end h-32">
        {exerciseChartData.labels.map((label, index) => {
          const heightPercent = (exerciseChartData.minutes[index] / maxMinutes) * 100;
          return (
            <div key={label} className="flex flex-col items-center space-y-2">
              <div className="flex items-end justify-center h-24 w-10">
                <div
                  className="w-8 bg-gradient-to-t from-teal-500 to-emerald-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 text-center">{label}</span>
              <span className="text-xs font-medium text-emerald-600">{exerciseChartData.minutes[index]}min</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium opacity-90">当前体重</h2>
              <p className="text-5xl font-bold mt-2">{mockUser.weight} <span className="text-2xl">kg</span></p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-1">
                  <TrendingDown className="h-4 w-4 text-green-200" />
                  <span className="text-sm">目标: {mockUser.targetWeight}kg</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingDown className="h-4 w-4 text-green-200" />
                  <span className="text-sm">体脂率: {mockUser.bodyFatRate}%</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">减脂进度</div>
              <div className="w-48 h-3 bg-white/20 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
              <div className="text-sm mt-2">已减 {mockUser.weight - mockUser.targetWeight}kg</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">今日消耗</p>
                <p className="text-xl font-bold text-gray-800">{mockDailyStats.caloriesBurned}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Droplets className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">今日饮水</p>
                <p className="text-xl font-bold text-gray-800">{mockDailyStats.waterIntake}ml</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Footprints className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">今日步数</p>
                <p className="text-xl font-bold text-gray-800">{mockDailyStats.steps}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Moon className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">睡眠时长</p>
                <p className="text-xl font-bold text-gray-800">{mockDailyStats.sleepHours}h</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">体重变化趋势</h3>
            {renderWeightChart()}
            <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-400 rounded" />
                <span className="text-xs text-gray-500">体重</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded" />
                <span className="text-xs text-gray-500">体脂率</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">本周卡路里收支</h3>
            {renderCaloriesChart()}
            <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-400 rounded" />
                <span className="text-xs text-gray-500">摄入</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded" />
                <span className="text-xs text-gray-500">消耗</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">运动时长统计</h3>
          {renderExerciseChart()}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">本周报告</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-emerald-600">{mockWeeklyReport.weightChange.toFixed(1)}kg</p>
              <p className="text-xs text-gray-500 mt-1">本周减重</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-teal-600">{mockWeeklyReport.totalExerciseMinutes}</p>
              <p className="text-xs text-gray-500 mt-1">运动分钟</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-orange-600">{mockWeeklyReport.totalCaloriesBurned}</p>
              <p className="text-xs text-gray-500 mt-1">消耗卡路里</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">{mockWeeklyReport.avgSteps}</p>
              <p className="text-xs text-gray-500 mt-1">平均步数</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
