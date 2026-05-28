import { TrendingDown, Flame, Droplets, Footprints, Moon, Target, Award, Activity, Heart, Trophy } from 'lucide-react';
import {
  useProfile, useWeightRecords, useExerciseRecords, useDietRecords,
  computeDailyStats, buildWeightChartData, buildCaloriesChartData,
  buildExerciseChartData, buildWeeklySummary,
} from '../stores/dataStore';

export default function DataDashboard() {
  const [profile] = useProfile();
  const [weightRecords] = useWeightRecords();
  const [exerciseRecords] = useExerciseRecords();
  const [dietRecords] = useDietRecords();

  const dailyStats = computeDailyStats(dietRecords, exerciseRecords);
  const weightChart = buildWeightChartData(weightRecords);
  const caloriesChart = buildCaloriesChartData(dietRecords, exerciseRecords);
  const exerciseChart = buildExerciseChartData(exerciseRecords);
  const weekly = buildWeeklySummary(weightRecords, exerciseRecords, dietRecords);

  const sortedWeight = [...weightRecords].sort((a, b) => a.date.localeCompare(b.date));
  const latestWeight = sortedWeight[sortedWeight.length - 1]?.weight ?? profile.weight;
  const startWeight = profile.startWeight ?? sortedWeight[0]?.weight ?? latestWeight;
  const targetWeight = profile.targetWeight;
  const totalLost = startWeight - latestWeight;
  const progressPercent = startWeight > targetWeight
    ? Math.max(0, Math.min(((startWeight - latestWeight) / (startWeight - targetWeight)) * 100, 100))
    : 0;

  const hasCalorieData = caloriesChart.intake.some(v => v > 0) || caloriesChart.burned.some(v => v > 0);
  const hasExerciseData = exerciseChart.labels.length > 0 && exerciseChart.minutes.some(v => v > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/30 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top weight card */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-200/50 animate-fade-in-up overflow-hidden relative">
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
                <span className="text-6xl lg:text-7xl font-bold animate-count">{latestWeight}</span>
                <span className="text-3xl lg:text-4xl opacity-90">kg</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <TrendingDown className="h-4 w-4 text-emerald-200" />
                  <span className="text-sm">目标: <span className="font-bold">{targetWeight}kg</span></span>
                </div>
                {profile.bodyFatRate > 0 && (
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                    <Activity className="h-4 w-4 text-emerald-200" />
                    <span className="text-sm">体脂率: <span className="font-bold">{profile.bodyFatRate}%</span></span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-auto text-center lg:text-right">
              <div className="text-sm opacity-90 mb-3">减脂进度</div>
              <div className="w-full lg:w-64 h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="h-full bg-white rounded-full transition-all duration-1000 shadow-lg animate-progress" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-center lg:justify-end gap-2">
                <Heart className="h-4 w-4 text-pink-300" />
                <span className="text-lg font-bold">
                  {totalLost > 0 ? `已减 ${totalLost.toFixed(1)}kg 🎉` : '开始你的减脂之旅 💪'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md shadow-orange-100/50 border border-orange-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-fade-in-up">
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-3 rounded-2xl w-fit mb-3">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">今日消耗</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{dailyStats.caloriesBurned}</p>
            <p className="text-xs text-gray-400 mt-2">kcal</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md shadow-blue-100/50 border border-blue-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-3 rounded-2xl w-fit mb-3">
              <Droplets className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">今日摄入</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{dailyStats.caloriesIntake}</p>
            <div className="mt-3 w-full bg-blue-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-700" style={{ width: `${Math.min((dailyStats.caloriesIntake / dailyStats.caloriesGoal) * 100, 100)}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md shadow-emerald-100/50 border border-emerald-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-3 rounded-2xl w-fit mb-3">
              <Footprints className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">今日步数</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">--</p>
            <p className="text-xs text-gray-400 mt-2">暂无数据</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md shadow-purple-100/50 border border-purple-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-2xl w-fit mb-3">
              <Moon className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">今日运动</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{dailyStats.caloriesBurned > 0 ? '✓' : '--'}</p>
            <p className="text-xs text-gray-400 mt-2">{dailyStats.caloriesBurned > 0 ? '已记录' : '暂无记录'}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Weight chart */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">体重变化趋势</h3>
              <div className="p-2 bg-emerald-50 rounded-xl">
                <TrendingDown className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            {weightChart.labels.length > 1 ? (
              <div className="space-y-4">
                {weightChart.labels.map((label, index) => {
                  const maxW = Math.max(...weightChart.weight) + 2;
                  const minW = Math.min(...weightChart.weight) - 2;
                  const r = maxW - minW || 1;
                  const h = ((weightChart.weight[index] - minW) / r) * 60 + 20;
                  return (
                    <div key={label} className="flex items-center gap-4">
                      <span className="w-10 text-sm text-gray-600 font-medium">{label}</span>
                      <div className="flex-1 h-10 flex items-end justify-center">
                        <div className="w-8 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all duration-700 cursor-pointer shadow-sm hover:shadow-md" style={{ height: `${h}%` }} />
                      </div>
                      <span className="w-14 text-sm font-bold text-emerald-700">{weightChart.weight[index]}kg</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-400">记录更多体重数据后显示趋势图 📊</div>
            )}
          </div>

          {/* Calories chart */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">本周卡路里收支</h3>
              <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs font-semibold text-emerald-700">7日</span>
              </div>
            </div>
            {hasCalorieData ? (
              <>
                <div className="space-y-4">
                  {caloriesChart.labels.map((label, index) => {
                    const maxVal = Math.max(...caloriesChart.intake, ...caloriesChart.burned) + 200 || 1;
                    const intakeW = (caloriesChart.intake[index] / maxVal) * 100;
                    const burnedW = (caloriesChart.burned[index] / maxVal) * 100;
                    const balance = caloriesChart.burned[index] - caloriesChart.intake[index];
                    return (
                      <div key={label + index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700 font-medium">{label}</span>
                          <span className={`font-bold ${balance > 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
                            {balance > 0 ? '+' : ''}{balance} kcal
                          </span>
                        </div>
                        <div className="h-5 bg-emerald-50 rounded-full overflow-hidden flex">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 rounded-full" style={{ width: `${intakeW}%` }} />
                          <div className="bg-gradient-to-r from-emerald-300 to-teal-200 transition-all duration-700 rounded-full" style={{ width: `${burnedW > intakeW ? burnedW - intakeW : 0}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
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
              </>
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-400">开始记录饮食和运动后显示 📊</div>
            )}
          </div>
        </div>

        {/* Exercise stats */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-50 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">运动时长统计</h3>
              <p className="text-xs text-gray-500 mt-1">按类型汇总</p>
            </div>
            <div className="flex items-center gap-2 text-sm bg-emerald-50 px-3 py-1.5 rounded-full">
              <Activity className="h-4 w-4 text-emerald-500" />
              <span className="font-semibold text-emerald-700">总计 {weekly.totalExerciseMinutes}分钟</span>
            </div>
          </div>
          {hasExerciseData ? (
            <div className="flex justify-around items-end h-36">
              {exerciseChart.labels.map((label, index) => {
                const maxMin = Math.max(...exerciseChart.minutes) || 1;
                const h = (exerciseChart.minutes[index] / maxMin) * 100;
                return (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div className="flex items-end justify-center h-28 w-12">
                      <div className="w-10 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-xl transition-all duration-700 cursor-pointer shadow-sm hover:shadow-md" style={{ height: `${Math.max(h, 8)}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600 text-center">{label}</span>
                    <span className="text-xs font-bold text-emerald-600">{exerciseChart.minutes[index]}min</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center text-gray-400">开始记录运动后显示 💪</div>
          )}
        </div>

        {/* Weekly report */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-50 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-2xl shadow-sm shadow-emerald-200">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">本周报告</h3>
                <p className="text-xs text-gray-500">{weekly.weekStart} ~ {weekly.weekEnd}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-2">{weekly.weightChange.toFixed(1)}kg</div>
              <p className="text-xs text-gray-500 mb-2">体重变化</p>
              <div className="flex items-center justify-center gap-1">
                <TrendingDown className={`h-3 w-3 ${weekly.weightChange <= 0 ? 'text-emerald-500' : 'text-orange-500'}`} />
                <span className={`text-xs font-semibold ${weekly.weightChange <= 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {weekly.weightChange <= 0 ? '继续保持!' : '加油控制~'}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{weekly.totalExerciseMinutes}</div>
              <p className="text-xs text-gray-500 mb-2">运动分钟</p>
              <div className="flex items-center justify-center gap-1">
                <Activity className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-semibold text-blue-600">{weekly.totalExerciseMinutes > 0 ? '活力满满' : '待记录'}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">{weekly.totalCaloriesBurned}</div>
              <p className="text-xs text-gray-500 mb-2">消耗卡路里</p>
              <div className="flex items-center justify-center gap-1">
                <Flame className="h-3 w-3 text-orange-500" />
                <span className="text-xs font-semibold text-orange-600">kcal</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{weekly.totalCaloriesIntake}</div>
              <p className="text-xs text-gray-500 mb-2">摄入卡路里</p>
              <div className="flex items-center justify-center gap-1">
                <Utensils className="h-3 w-3 text-purple-500" />
                <span className="text-xs font-semibold text-purple-600">kcal</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          {totalLost > 0 && (
            <div className="mt-6 pt-5 border-t border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-bold text-gray-700">成就</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {totalLost >= 0.5 && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-full px-3 py-1.5">
                    <span className="text-base">🏆</span>
                    <span className="text-xs font-semibold text-amber-700">减重{totalLost.toFixed(1)}kg</span>
                  </div>
                )}
                {weekly.totalExerciseMinutes >= 60 && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-full px-3 py-1.5">
                    <span className="text-base">🔥</span>
                    <span className="text-xs font-semibold text-emerald-700">运动达标</span>
                  </div>
                )}
                {weightRecords.length >= 5 && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-full px-3 py-1.5">
                    <span className="text-base">📊</span>
                    <span className="text-xs font-semibold text-blue-700">坚持记录</span>
                  </div>
                )}
                {dietRecords.length >= 10 && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-full px-3 py-1.5">
                    <span className="text-base">🍽️</span>
                    <span className="text-xs font-semibold text-orange-700">饮食记录达人</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Small inline icon for the weekly report
function Utensils(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}
