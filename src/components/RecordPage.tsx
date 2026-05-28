import { useState } from 'react';
import { Scale, UtensilsCrossed, Dumbbell, TrendingDown, Flame, Plus, Trash2, X } from 'lucide-react';
import {
  useWeightRecords, useExerciseRecords, useDietRecords,
  addWeightRecord, addExerciseRecord, addDietRecord,
  getTodayDiet, getTodayExercise,
} from '../stores/dataStore';
import type { DietRecord, ExerciseRecord } from '../types';

type RecordTab = 'weight' | 'diet' | 'exercise';

export default function RecordPage() {
  const [activeRecordTab, setActiveRecordTab] = useState<RecordTab>('weight');
  const [weightRecords, setWeightRecords] = useWeightRecords();
  const [exerciseRecords, setExerciseRecords] = useExerciseRecords();
  const [dietRecords, setDietRecords] = useDietRecords();

  // ── Modal state ──
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showDietModal, setShowDietModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);

  // ── Form state ──
  const [weightInput, setWeightInput] = useState('');
  const [bodyFatInput, setBodyFatInput] = useState('');
  const [dietForm, setDietForm] = useState({ mealType: 'lunch' as DietRecord['mealType'], food: '', calories: '', protein: '', carbs: '', fat: '' });
  const [exerciseForm, setExerciseForm] = useState({ type: 'cardio' as ExerciseRecord['type'], description: '', duration: '', calories: '' });

  const tabs = [
    { id: 'weight' as const, label: '体重', icon: Scale },
    { id: 'diet' as const, label: '饮食', icon: UtensilsCrossed },
    { id: 'exercise' as const, label: '运动', icon: Dumbbell },
  ];

  const mealLabels: Record<string, string> = { breakfast: '🌅 早餐', lunch: '☀️ 午餐', dinner: '🌙 晚餐', snack: '🍪 加餐' };
  const exerciseLabels: Record<string, string> = { cardio: '🏃 有氧', strength: '💪 力量', yoga: '🧘 瑜伽', flexibility: '🤸 柔韧' };

  const todayDiet = getTodayDiet(dietRecords);
  const todayExercise = getTodayExercise(exerciseRecords);
  const totalCalIn = todayDiet.reduce((s, r) => s + r.calories, 0);
  const totalCalOut = todayExercise.reduce((s, r) => s + r.calories, 0);

  // ── Handlers ──
  const handleAddWeight = () => {
    const w = parseFloat(weightInput);
    if (isNaN(w) || w < 20 || w > 300) return;
    const bf = parseFloat(bodyFatInput);
    addWeightRecord(setWeightRecords, w, isNaN(bf) ? undefined : bf);
    setWeightInput('');
    setBodyFatInput('');
    setShowWeightModal(false);
  };

  const handleAddDiet = () => {
    const cal = parseInt(dietForm.calories);
    if (!dietForm.food || isNaN(cal)) return;
    addDietRecord(setDietRecords, {
      mealType: dietForm.mealType,
      food: dietForm.food,
      calories: cal,
      protein: parseInt(dietForm.protein) || 0,
      carbs: parseInt(dietForm.carbs) || 0,
      fat: parseInt(dietForm.fat) || 0,
    });
    // Reset
    setDietForm({ mealType: 'lunch', food: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowDietModal(false);
  };

  const handleAddExercise = () => {
    const dur = parseInt(exerciseForm.duration);
    const cal = parseInt(exerciseForm.calories);
    if (!exerciseForm.description || isNaN(dur)) return;
    addExerciseRecord(setExerciseRecords, {
      type: exerciseForm.type,
      description: exerciseForm.description,
      duration: dur,
      calories: isNaN(cal) ? Math.round(dur * 6) : cal,
    });
    setExerciseForm({ type: 'cardio', description: '', duration: '', calories: '' });
    setShowExerciseModal(false);
  };

  const deleteWeight = (date: string) => {
    setWeightRecords(prev => prev.filter(r => r.date !== date));
  };

  // ── Weight chart ──
  const sortedWeight = [...weightRecords].sort((a, b) => a.date.localeCompare(b.date));
  const chartData = sortedWeight.slice(-10);
  const maxW = chartData.length ? Math.max(...chartData.map(r => r.weight)) + 1 : 100;
  const minW = chartData.length ? Math.min(...chartData.map(r => r.weight)) - 1 : 50;
  const range = maxW - minW || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/30 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-bold text-gray-800">📝 记录</h1>
          <p className="text-sm text-gray-500 mt-1">记录你的饮食、运动和体重变化</p>
        </div>

        {/* Today summary */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-orange-50 text-center">
            <Flame className="h-5 w-5 text-orange-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-800">{totalCalIn}</p>
            <p className="text-xs text-gray-500">摄入 kcal</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-emerald-50 text-center">
            <Dumbbell className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-800">{totalCalOut}</p>
            <p className="text-xs text-gray-500">消耗 kcal</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-50 text-center">
            <TrendingDown className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-800">{totalCalOut - totalCalIn}</p>
            <p className="text-xs text-gray-500">赤字 kcal</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-emerald-50/80 rounded-2xl p-1 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveRecordTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeRecordTab === tab.id
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

        {/* ═══════ WEIGHT ═══════ */}
        {activeRecordTab === 'weight' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">体重记录</h2>
              <button onClick={() => setShowWeightModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-200">
                <Plus className="h-4 w-4" /> 记录体重
              </button>
            </div>

            {chartData.length > 1 && (
              <div className="bg-white rounded-2xl p-5 shadow-md border border-emerald-50">
                <div className="flex items-end justify-around h-40 mb-4">
                  {chartData.map((record) => {
                    const h = ((record.weight - minW) / range) * 100;
                    return (
                      <div key={record.date} className="flex flex-col items-center gap-1.5">
                        <span className="text-xs font-bold text-emerald-700">{record.weight}</span>
                        <div className="w-8 h-28 flex items-end">
                          <div className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg" style={{ height: `${Math.max(h, 10)}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{new Date(record.date).getMonth() + 1}/{new Date(record.date).getDate()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-md border border-emerald-50 overflow-hidden">
              {sortedWeight.length === 0 && (
                <div className="p-8 text-center text-gray-400">还没有记录，点击上方按钮开始吧 💪</div>
              )}
              {[...sortedWeight].reverse().map((record, i, arr) => (
                <div key={record.date + i} className={`flex items-center justify-between p-4 ${i > 0 ? 'border-t border-gray-50' : ''} hover:bg-emerald-50/30 transition-colors`}>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{record.date}</p>
                    {record.bodyFatRate && <p className="text-xs text-gray-500">体脂率: {record.bodyFatRate}%</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-emerald-700">{record.weight}kg</span>
                    {i < arr.length - 1 && (
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${record.weight < arr[i + 1].weight ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                        {record.weight < arr[i + 1].weight ? '↓' : '↑'}{Math.abs(record.weight - arr[i + 1].weight).toFixed(1)}
                      </span>
                    )}
                    <button onClick={() => deleteWeight(record.date)} className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════ DIET ═══════ */}
        {activeRecordTab === 'diet' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">今日饮食</h2>
              <button onClick={() => setShowDietModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-md shadow-orange-200">
                <Plus className="h-4 w-4" /> 记录饮食
              </button>
            </div>

            {todayDiet.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-md border border-orange-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">今日热量摄入</span>
                  <span className="text-sm font-bold text-orange-600">{totalCalIn} / 1800 kcal</span>
                </div>
                <div className="w-full bg-orange-100 rounded-full h-3">
                  <div className="bg-gradient-to-r from-orange-400 to-amber-400 h-3 rounded-full transition-all duration-700" style={{ width: `${Math.min((totalCalIn / 1800) * 100, 100)}%` }} />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>蛋白: {todayDiet.reduce((s, r) => s + r.protein, 0)}g</span>
                  <span>碳水: {todayDiet.reduce((s, r) => s + r.carbs, 0)}g</span>
                  <span>脂肪: {todayDiet.reduce((s, r) => s + r.fat, 0)}g</span>
                </div>
              </div>
            )}

            {todayDiet.length === 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-md border border-orange-50 text-center text-gray-400">
                今天还没有记录饮食哦 🍽️
              </div>
            )}

            {todayDiet.map((record) => (
              <div key={record.id} className="bg-white rounded-2xl p-4 shadow-md border border-orange-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-800">{mealLabels[record.mealType] || record.mealType}</span>
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

            {/* History */}
            {dietRecords.filter(r => r.date !== new Date().toISOString().slice(0, 10)).length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-50 overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-500">历史记录</p>
                </div>
                {[...dietRecords].filter(r => r.date !== new Date().toISOString().slice(0, 10)).reverse().slice(0, 10).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border-t border-gray-50">
                    <div>
                      <p className="text-sm text-gray-800">{record.food}</p>
                      <p className="text-xs text-gray-400">{record.date} · {mealLabels[record.mealType]}</p>
                    </div>
                    <span className="text-sm font-bold text-orange-600">{record.calories}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════ EXERCISE ═══════ */}
        {activeRecordTab === 'exercise' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">运动记录</h2>
              <button onClick={() => setShowExerciseModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-200">
                <Plus className="h-4 w-4" /> 记录运动
              </button>
            </div>

            {todayExercise.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">今日运动</p>
                    <p className="text-3xl font-bold text-gray-800">{todayExercise.reduce((s, r) => s + r.duration, 0)}分钟</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">消耗热量</p>
                    <p className="text-3xl font-bold text-blue-600">{todayExercise.reduce((s, r) => s + r.calories, 0)}</p>
                    <p className="text-xs text-gray-400">kcal</p>
                  </div>
                </div>
              </div>
            )}

            {todayExercise.length === 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-md border border-blue-50 text-center text-gray-400">
                今天还没有运动记录 🏃
              </div>
            )}

            {todayExercise.map((record) => (
              <div key={record.id} className="bg-white rounded-2xl p-4 shadow-md border border-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg">{exerciseLabels[record.type]?.split(' ')[0] || '🏋️'}</div>
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

            {/* History */}
            {exerciseRecords.filter(r => r.date !== new Date().toISOString().slice(0, 10)).length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-50 overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-500">历史记录</p>
                </div>
                {[...exerciseRecords].filter(r => r.date !== new Date().toISOString().slice(0, 10)).reverse().slice(0, 10).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border-t border-gray-50">
                    <div>
                      <p className="text-sm text-gray-800">{record.description}</p>
                      <p className="text-xs text-gray-400">{record.date} · {exerciseLabels[record.type]}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-blue-600">{record.calories} kcal</span>
                      <p className="text-xs text-gray-400">{record.duration}min</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════ MODALS ═══════ */}

      {/* Weight modal */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowWeightModal(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">记录体重</h3>
              <button onClick={() => setShowWeightModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">体重 (kg) *</label>
                <input type="number" step="0.1" value={weightInput} onChange={e => setWeightInput(e.target.value)} placeholder="例如: 75.5" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 text-lg" autoFocus />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">体脂率 (%) <span className="text-gray-400">可选</span></label>
                <input type="number" step="0.1" value={bodyFatInput} onChange={e => setBodyFatInput(e.target.value)} placeholder="例如: 22.5" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 text-lg" />
              </div>
              <button onClick={handleAddWeight} className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-200 text-lg">
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diet modal */}
      {showDietModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowDietModal(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-fade-in-up max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">记录饮食</h3>
              <button onClick={() => setShowDietModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">餐次</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(mt => (
                    <button key={mt} onClick={() => setDietForm(f => ({ ...f, mealType: mt }))} className={`py-2 rounded-xl text-xs font-medium transition-colors ${dietForm.mealType === mt ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}>
                      {mealLabels[mt]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">吃了什么 *</label>
                <input type="text" value={dietForm.food} onChange={e => setDietForm(f => ({ ...f, food: e.target.value }))} placeholder="例如: 鸡胸肉沙拉" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">热量 (kcal) *</label>
                  <input type="number" value={dietForm.calories} onChange={e => setDietForm(f => ({ ...f, calories: e.target.value }))} placeholder="350" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">蛋白质 (g)</label>
                  <input type="number" value={dietForm.protein} onChange={e => setDietForm(f => ({ ...f, protein: e.target.value }))} placeholder="25" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">碳水 (g)</label>
                  <input type="number" value={dietForm.carbs} onChange={e => setDietForm(f => ({ ...f, carbs: e.target.value }))} placeholder="40" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">脂肪 (g)</label>
                  <input type="number" value={dietForm.fat} onChange={e => setDietForm(f => ({ ...f, fat: e.target.value }))} placeholder="12" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" />
                </div>
              </div>
              <button onClick={handleAddDiet} className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-md shadow-orange-200 text-lg">
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise modal */}
      {showExerciseModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowExerciseModal(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">记录运动</h3>
              <button onClick={() => setShowExerciseModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">运动类型</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['cardio', 'strength', 'yoga', 'flexibility'] as const).map(t => (
                    <button key={t} onClick={() => setExerciseForm(f => ({ ...f, type: t }))} className={`py-2 rounded-xl text-xs font-medium transition-colors ${exerciseForm.type === t ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                      {exerciseLabels[t]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">运动内容 *</label>
                <input type="text" value={exerciseForm.description} onChange={e => setExerciseForm(f => ({ ...f, description: e.target.value }))} placeholder="例如: 跑步5公里" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400" autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">时长 (分钟) *</label>
                  <input type="number" value={exerciseForm.duration} onChange={e => setExerciseForm(f => ({ ...f, duration: e.target.value }))} placeholder="45" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">消耗 (kcal) <span className="text-gray-400">自动估算</span></label>
                  <input type="number" value={exerciseForm.calories} onChange={e => setExerciseForm(f => ({ ...f, calories: e.target.value }))} placeholder="自动" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <button onClick={handleAddExercise} className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-200 text-lg">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
