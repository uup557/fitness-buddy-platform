import { User, Settings, Target, Calendar, Ruler, Weight, LogOut, Bell, Shield, HelpCircle } from 'lucide-react';
import { mockUser } from '../data/mockData';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/30 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-50 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{mockUser.name}</h2>
              <p className="text-sm text-gray-500 mt-1">AI减脂伙伴 · Lv.5</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">🌱 成长中</span>
                <span className="text-xs text-gray-400">加入于 {mockUser.startDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 目标进度 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-50 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-xl">
              <Target className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">减脂目标</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-emerald-50">
              <div className="flex items-center gap-3">
                <Weight className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">起始体重</span>
              </div>
              <span className="text-lg font-bold text-gray-800">{mockUser.startWeight}kg</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-emerald-50">
              <div className="flex items-center gap-3">
                <Weight className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-gray-600">当前体重</span>
              </div>
              <span className="text-lg font-bold text-emerald-600">{mockUser.weight}kg</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-emerald-50">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">目标体重</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{mockUser.targetWeight}kg</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Ruler className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">身高</span>
              </div>
              <span className="text-lg font-bold text-gray-800">{mockUser.height}cm</span>
            </div>
          </div>
          {/* 进度条 */}
          <div className="mt-4 pt-4 border-t border-emerald-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">减脂进度</span>
              <span className="text-sm font-bold text-emerald-600">
                已减 {mockUser.startWeight - mockUser.weight}kg / 目标 {mockUser.startWeight - mockUser.targetWeight}kg
              </span>
            </div>
            <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(Math.max(((mockUser.startWeight - mockUser.weight) / (mockUser.startWeight - mockUser.targetWeight)) * 100, 0), 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 设置列表 */}
        <div className="bg-white rounded-2xl shadow-md border border-emerald-50 overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="p-5 border-b border-emerald-50">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-xl">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">设置</h3>
            </div>
          </div>
          <div className="divide-y divide-emerald-50">
            <button className="w-full flex items-center justify-between p-4 hover:bg-emerald-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-gray-700">提醒设置</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-emerald-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-gray-700">目标截止日期</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-emerald-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-gray-700">隐私设置</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          </div>
        </div>

        {/* 关于 */}
        <div className="bg-white rounded-2xl shadow-md border border-emerald-50 overflow-hidden animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="divide-y divide-emerald-50">
            <button className="w-full flex items-center justify-between p-4 hover:bg-emerald-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">帮助与反馈</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">版本</span>
              </div>
              <span className="text-sm text-gray-400">v1.0.0</span>
            </div>
            <button className="w-full flex items-center justify-center p-4 text-red-500 hover:bg-red-50/50 transition-colors gap-2">
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">退出登录</span>
            </button>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">🌱 AI减脂伙伴 · 让健康更简单</p>
        </div>
      </div>
    </div>
  );
}
