import { Dumbbell, Users, Calendar, TrendingUp } from 'lucide-react';

export default function HeroBanner() {
  const stats = [
    { icon: Users, value: '50,000+', label: '活跃用户' },
    { icon: Calendar, value: '10,000+', label: '活动场次' },
    { icon: TrendingUp, value: '98%', label: '匹配成功率' },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 mb-8 lg:mb-0">
            <div className="flex items-center space-x-3 mb-4">
              <Dumbbell className="h-12 w-12" />
              <span className="text-4xl font-bold">健身搭子</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              找到你的
              <span className="bg-white/20 px-3 py-1 rounded-lg ml-2">专属健身搭子</span>
            </h1>
            <p className="text-lg text-white/80 mb-6 max-w-xl">
              加入我们的健身社区，与志同道合的小伙伴一起运动，互相监督，共同进步！无论你是跑步、瑜伽还是力量训练，都能找到适合的搭子。
            </p>
            <div className="flex space-x-4">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                立即加入
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                了解更多
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="text-center">
                  <Dumbbell className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-2xl font-bold">开始运动</p>
                  <p className="text-white/70">找到你的搭子</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white text-indigo-600 px-4 py-2 rounded-full font-semibold shadow-lg">
                +2,000 本周加入
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <Icon className="h-8 w-8 mx-auto mb-2" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-white/70">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
