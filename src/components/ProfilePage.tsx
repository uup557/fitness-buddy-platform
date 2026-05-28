import { useState } from 'react';
import { MapPin, Calendar, Target, TrendingDown, Award, ChevronRight, Flame, Activity, Moon, Droplets, X, Save } from 'lucide-react';
import { useProfile, useWeightRecords, useExerciseRecords, useDietRecords } from '../stores/dataStore';

export default function ProfilePage() {
  const [profile, setProfile] = useProfile();
  const [weightRecords] = useWeightRecords();
  const [exerciseRecords] = useExerciseRecords();
  const [dietRecords] = useDietRecords();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });

  const totalDays = Math.floor((Date.now() - new Date(profile.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const sortedWeight = [...weightRecords].sort((a, b) => a.date.localeCompare(b.date));
  const latestWeight = sortedWeight[sortedWeight.length - 1]?.weight ?? profile.weight;
  const startWeight = profile.startWeight ?? sortedWeight[0]?.weight ?? latestWeight;
  const totalLost = startWeight - latestWeight;
  const remaining = latestWeight - profile.targetWeight;
  const progressPercent = startWeight > profile.targetWeight
    ? Math.max(0, Math.min(((startWeight - latestWeight) / (startWeight - profile.targetWeight)) * 100, 100))
    : 0;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCalIn = dietRecords.filter(r => r.date === todayStr).reduce((s, r) => s + r.calories, 0);
  const todayCalOut = exerciseRecords.filter(r => r.date === todayStr).reduce((s, r) => s + r.calories, 0);

  const achievements = [
    { emoji: '🏆', label: '坚持打卡', desc: `${totalDays}天`, active: totalDays > 0 },
    { emoji: '🔥', label: '累计运动', desc: `${exerciseRecords.length}次`, active: exerciseRecords.length > 0 },
    { emoji: '📉', label: '已减重', desc: `${Math.abs(totalLost).toFixed(1)}kg`, active: totalLost > 0 },
    { emoji: '📊', label: '体重记录', desc: `${weightRecords.length}次`, active: weightRecords.length > 0 },
  ];

  const handleSaveProfile = () => {
    const w = parseFloat(String(editForm.weight));
    const tw = parseFloat(String(editForm.targetWeight));
    const h = parseFloat(String(editForm.height));
    const bf = parseFloat(String(editForm.bodyFatRate));
    setProfile({
      ...editForm,
      weight: isNaN(w) ? profile.weight : w,
      targetWeight: isNaN(tw) ? profile.targetWeight : tw,
      height: isNaN(h) ? profile.height : h,
      bodyFatRate: isNaN(bf) ? profile.bodyFatRate : bf,
      age: parseInt(String(editForm.age)) || profile.age,
    });
    setShowEditModal(false);
  };

  const menuItems = [
    { label: '编辑资料', icon: Activity, desc: '体重、目标、身体数据', action: () => { setEditForm({ ...profile }); setShowEditModal(true); } },
    { label: '数据报告', icon: Target, desc: '查看详细减脂趋势', action: () => {} },
    { label: '关于', icon: Award, desc: 'v1.0.0 · AI减脂伙伴', action: () => {} },
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
                {profile.name.slice(0, 1)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-amber-900 border-2 border-white shadow">
                Lv.5
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-white/80">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> 中国</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {totalDays > 0 ? `加入 ${totalDays} 天` : '今天加入'}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-white/15 px-2.5 py-1 rounded-full text-xs">{profile.age}岁</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-full text-xs">{profile.height}cm</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-full text-xs">{latestWeight}kg</span>
                {profile.bodyFatRate > 0 && <span className="bg-white/15 px-2.5 py-1 rounded-full text-xs">体脂 {profile.bodyFatRate}%</span>}
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
            <span className="text-sm text-emerald-600 font-semibold">目标 {profile.targetWeight}kg</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{latestWeight}kg</p>
              <p className="text-xs text-gray-500">当前</p>
            </div>
            <div className="flex-1 relative">
              <div className="w-full bg-emerald-100 rounded-full h-3">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
              </div>
              <TrendingDown className="absolute -top-5 left-1/2 -translate-x-1/2 h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{profile.targetWeight}kg</p>
              <p className="text-xs text-gray-500">目标</p>
            </div>
          </div>
          <p className="text-center text-sm text-emerald-600 font-medium">
            {remaining > 0
              ? `还需减 ${remaining.toFixed(1)}kg · 已减 ${totalLost.toFixed(1)}kg 💪`
              : totalLost > 0
                ? `🎉 恭喜达成目标！已减 ${totalLost.toFixed(1)}kg`
                : '设定目标，开始你的减脂之旅 🌱'}
          </p>
        </div>

        {/* Achievements */}
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-bold text-gray-800 mb-3">🏅 成就</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {achievements.map((a) => (
              <div key={a.label} className={`bg-white rounded-2xl p-4 shadow-md border text-center hover:shadow-lg hover:scale-[1.02] transition-all ${a.active ? 'border-amber-100' : 'border-gray-100 opacity-50'}`}>
                <div className="text-3xl mb-2">{a.emoji}</div>
                <p className="text-lg font-bold text-gray-800">{a.desc}</p>
                <p className="text-xs text-gray-500">{a.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Today stats */}
        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-lg font-bold text-gray-800 mb-3">📊 今日概览</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-orange-50">
              <Flame className="h-5 w-5 text-orange-500 mb-2" />
              <p className="text-xl font-bold text-gray-800">{todayCalOut || '--'}</p>
              <p className="text-xs text-gray-500">消耗热量</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-50">
              <Droplets className="h-5 w-5 text-blue-500 mb-2" />
              <p className="text-xl font-bold text-gray-800">{todayCalIn || '--'}</p>
              <p className="text-xs text-gray-500">摄入热量</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md border border-emerald-50">
              <Activity className="h-5 w-5 text-emerald-500 mb-2" />
              <p className="text-xl font-bold text-gray-800">{exerciseRecords.length}</p>
              <p className="text-xs text-gray-500">运动记录</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md border border-purple-50">
              <Moon className="h-5 w-5 text-purple-500 mb-2" />
              <p className="text-xl font-bold text-gray-800">{dietRecords.length}</p>
              <p className="text-xs text-gray-500">饮食记录</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-md border border-emerald-50 overflow-hidden animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={item.label} onClick={item.action} className={`w-full flex items-center gap-4 p-4 hover:bg-emerald-50/30 transition-colors text-left ${i > 0 ? 'border-t border-gray-50' : ''}`}>
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
      </div>

      {/* Edit profile modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">编辑资料</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">昵称</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">年龄</label>
                  <input type="number" value={editForm.age} onChange={e => setEditForm(f => ({ ...f, age: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">身高 (cm)</label>
                  <input type="number" value={editForm.height} onChange={e => setEditForm(f => ({ ...f, height: parseFloat(e.target.value) || 0 }))} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">当前体重 (kg)</label>
                  <input type="number" step="0.1" value={editForm.weight} onChange={e => setEditForm(f => ({ ...f, weight: parseFloat(e.target.value) || 0 }))} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">目标体重 (kg)</label>
                  <input type="number" step="0.1" value={editForm.targetWeight} onChange={e => setEditForm(f => ({ ...f, targetWeight: parseFloat(e.target.value) || 0 }))} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">起始体重 (kg)</label>
                  <input type="number" step="0.1" value={editForm.startWeight ?? editForm.weight} onChange={e => setEditForm(f => ({ ...f, startWeight: parseFloat(e.target.value) || 0 }))} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">体脂率 (%)</label>
                  <input type="number" step="0.1" value={editForm.bodyFatRate} onChange={e => setEditForm(f => ({ ...f, bodyFatRate: parseFloat(e.target.value) || 0 }))} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400" />
                </div>
              </div>
              <button onClick={handleSaveProfile} className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-200 text-lg flex items-center justify-center gap-2">
                <Save className="h-5 w-5" /> 保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
