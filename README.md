# AI 减脂教练

一个由 AI Agent 主导的个人减脂陪伴软件，通过智能对话和数据可视化帮助用户实现健康减脂目标。

## 功能特性

- 💬 **AI 对话**：与 AI 减脂教练进行智能对话，获取个性化建议
- 📊 **数据报告**：可视化展示体重变化、体脂率、运动记录等数据
- 🎯 **目标追踪**：设定减脂目标并追踪进度
- 📈 **趋势分析**：分析减脂趋势，提供科学建议

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **样式**: Tailwind CSS 3
- **图标**: Lucide React

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
src/
├── components/
│   ├── Navbar.tsx       # 导航栏
│   ├── ChatPanel.tsx    # 对话面板
│   ├── MessageBubble.tsx # 消息气泡
│   ├── DataDashboard.tsx # 数据仪表盘
│   └── ChartCard.tsx    # 图表卡片
├── data/
│   └── mockData.ts      # 模拟数据
├── types/
│   └── index.ts         # TypeScript 类型定义
├── App.tsx              # 主应用组件
├── main.tsx             # 入口文件
└── index.css            # 全局样式
```

## 页面说明

### 对话页面
- AI 减脂教练聊天界面
- 支持发送消息和接收 AI 回复
- 显示聊天历史记录

### 数据报告页面
- 体重变化趋势图
- 体脂率分析
- 运动记录统计
- 卡路里摄入/消耗统计

## 许可证

MIT License
