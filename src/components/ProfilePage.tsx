import { MapPin, Calendar, Target, TrendingDown, Award, Settings, ChevronRight, Flame, Activity, Moon, Droplets } from 'lucide-react';
import { mockUser, mockDailyStats, mockWeightRecords, mockExerciseRecords } from '../data/mockData';

export default function ProfilePage() {
  const totalDays = Math.floor((Date.now() - new Date(mockUser.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const weightLost = mockUser.weight - mockUser.targetWeight;
  const totalWeightLost = mockUser.weight - mockWeightRecords[0].weight;

  const achievements = [
    { emoji: '🏆', label: '坚持打卡', desc: `${totalDays}天` },
    { emoji: '🔥', label: '累计运动', desc: `${mockExerciseRecords.length}次` },
    { emoji: '📉', label: '已减重', desc: `${Math.abs(totalWeightLost).toFixed(1)}kg` },
    { emoji: '💧', label: '饮水达标', desc: '本周5天' },
  ];

  const menuItems = [
    { label: '身体数据', icon: Activity, desc: '身高、体重、体脂率' },
    { label: '目标设置', icon: Target, desc: '减脂目标与计划' },
    { label: '提醒设置', icon: Moon, desc: '喝水、运动、睡眠提醒' },
    { label: '数据导出', icon: Droplets, desc: '导出健康报告' },
    { label: '关于', icon: Award, desc: '版本信息与帮助' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/30 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Profile header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-200/50 animate-fade-in-up overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                {mockUser.name.slice(0, 1)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-amber-900 border-2 border-white shadow">
                Lv.5
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{mockUser.name}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-white/80">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> 中国</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> 加入 {totalDays} 天</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-white/15 px-2.5 py-1 rounded-full text-xs">{mockUser.age}岁</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-full text-xs">{mockUser.height}cm</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-full text-xs">{mockUser.weight}kg</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-full text-xs">体脂 {mockUser.bodyFatRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Goal progress */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-emerald-50 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" />
              <span className="font-bold text-gray-800">减脂目标</span>
            </div>
            <span className="text-sm text-emerald-600 font-semibold">目标 {mockUser.targetWeight}kg</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{mockUser.weight}kg</p>
              <p className="text-xs text-gray-500">当前</p>
            </div>
            <div className="flex-1 relative">
              <div className="w-full bg-emerald-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(Math.max(((mockUser.weight - mockUser.targetWeight) / (mockUser.startWeight - mockUser.targetWeight)) * 100, 0), 100)}%` }}
                />
              </div>
              <TrendingDown className="absolute -top-5 left-1/2 -translate-x-1/2 h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{mockUser.targetWeight}kg</p>
              <p className="text-xs text-gray-500">目标</p>
            </div>
          </div>
          <p className="text-center text-sm text-emerald-600 font-medium">
            还需减 {weightLost.toFixed(1)}kg · 已减 {Math.abs(totalWeightLost).toFixed(1)}kg 💪
          </p>
        </div>

        {/* Achievements */}
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-bold text-gray-800 mb-3">🏅 成就</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {achievements.map((a) => (
              <div key={a.label} className="bg-white rounded-2xl p-4 shadow-md border border-amber-50 text-center hover:shadow-lg hover:scale-[1.02] transition-all">
                <div className="text-3xl mb-2">{a.emoji}</div>
                <p className="text-lg font-bold text-gray-800">{a.desc}</p>
                <p className="text-xs text-gray-500">{a.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-lg font-bold text-gray-800 mb-3">📊 今日概览</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-orange-50">
              <Flame className="h-5 w-5 text-orange-500 mb-2" />
              <p className="text-xl font-bold text-gray-800">{mockDailyStats.caloriesBurned}</p>
              <p className="text-xs text-gray-500">消耗热量</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-50">
              <Droplets className="h-5 w-5 text-blue-500 mb-2" />
              <p className="text-xl font-bold text-gray-800">{mockDailyStats.waterIntake}ml</p>
              <p className="text-xs text-gray-500">饮水量</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md border border-emerald-50">
              <Activity className="h-5 w-5 text-emerald-500 mb-2" />
              <p className="text-xl font-bold text-gray-800">{mockDailyStats.steps.toLocaleString()}</p>
              <p className="text-xs text-gray-500">步数</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md border border-purple-50">
              <Moon className="h-5 w-5 text-purple-500 mb-2" />
              <p className="text-xl font-bold text-gray-800">{mockDailyStats.sleepHours}h</p>
              <p className="text-xs text-gray-500">睡眠</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-md border border-emerald-50 overflow-hidden animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-4 p-4 hover:bg-emerald-50/30 transition-colors text-left ${
                  i > 0 ? 'border-t border-gray-50' : ''
                }`}
              >
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </button>
            );
          })}
        </div>

        {/* Settings shortcut */}
        <button className="w-full flex items-center justify-center gap-2 py-3 text-gray-400 hover:text-emerald-600 transition-colors text-sm">
          <Settings className="h-4 w-4" />
          设置
        </button>
      </div>
    </div>
  );
}
