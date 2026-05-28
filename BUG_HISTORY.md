# Bug 历史记录

## 📋 说明
本文档记录所有遇到的技术问题、解决方案和预防措施，便于后续排查类似问题。

---

## 🐛 Bug #1: TypeScript类型定义缺失

**日期**: 2026-05-27  
**严重程度**: 🔴 高  
**状态**: ✅ 已修复

### 问题描述
Vercel构建失败，TypeScript报错缺少以下类型定义：
- `Module '"../types"' has no exported member 'Activity'`
- `Module '"../types"' has no exported member 'CommunityPost'`
- `Module '"../types"' has no exported member 'User'`

### 根本原因
组件文件引用了types中未定义的新增类型

### 修复方案
在 `src/types/index.ts` 中添加缺失的类型定义

### 预防措施
- ⚠️ 添加新类型后，立即检查所有引用该类型的组件
- ⚠️ 提交前运行 `npm run build` 验证
- ⚠️ 使用一致的命名规范

---

## 🐛 Bug #2: 未使用的导入导致TypeScript错误

**日期**: 2026-05-27  
**严重程度**: 🟡 中  
**状态**: ✅ 已修复

### 问题描述
`src/components/DataDashboard.tsx(1,24): error TS6133: 'TrendingUp' is declared but its value is never read.`

### 预防措施
- ⚠️ 定期检查ESLint警告
- ⚠️ 使用IDE的代码检查功能

---

## 🐛 Bug #3: 隐式any类型参数

**日期**: 2026-05-27  
**严重程度**: 🟡 中  
**状态**: ✅ 已修复

### 问题描述
.map()回调函数中的参数没有明确类型注解

### 预防措施
- ⚠️ 在tsconfig.json中启用严格模式
- ⚠️ 避免使用any类型

---

## 🐛 Bug #4: GitHub仓库文件与本地不同步

**日期**: 2026-05-27  
**严重程度**: 🔴 高  
**状态**: ✅ 已修复

### 问题描述
Vercel部署的是旧版本应用，缺少最新的侧边栏和聊天切换功能

### 根本原因
GitHub上的代码是旧版本，缺少关键组件和数据结构

### 修复方案
推送完整的最新代码到GitHub main分支

### 预防措施
- ⚠️ 修改代码后立即同步到GitHub
- ⚠️ 使用git status检查未提交的文件
- ⚠️ 部署前验证GitHub上的代码是最新的
- ⚠️ 创建本地和GitHub的完整备份机制

---

## 🐛 Bug #5: Mock数据导出缺失

**日期**: 2026-05-27  
**严重程度**: 🔴 高  
**状态**: ✅ 已修复

### 问题描述
`src/components/ChatPanel.tsx(4,10): error TS2305: Module '"../data/mockData"' has no exported member 'chatMessagesMap'.`

### 修复方案
在 `src/data/mockData.ts` 中添加完整的聊天数据映射：
- `mockChat1Messages`
- `mockChat2Messages`
- `mockChat3Messages`
- `mockChat4Messages`
- `chatMessagesMap`

### 预防措施
- ⚠️ 添加新导出前先检查是否在其他地方引用
- ⚠️ 使用统一的数据导出模式
- ⚠️ 建立数据结构的完整文档

---

## 🐛 Bug #6: Tailwind CSS版本语法不匹配

**日期**: 2026-05-27  
**严重程度**: 🔴 高  
**状态**: ✅ 已修复

### 问题描述
GitHub上的 `src/index.css` 使用了Tailwind CSS v3语法，但项目使用的是v4：
```css
/* ❌ 错误 - v3语法 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ✅ 正确 - v4语法 */
@import "tailwindcss";
```

### 根本原因
项目使用 `@tailwindcss/vite` 插件（v4特性），但CSS文件未同步更新

### 修复方案
修改 `src/index.css` 使用v4语法

### 预防措施
- ⚠️ 项目升级依赖时同步更新配置
- ⚠️ package.json和配置文件保持版本一致
- ⚠️ 查阅官方升级指南

### 相关文件
- `src/index.css`
- `vite.config.ts`
- `package.json`

---

## 🐛 Bug #7: Capacitor加载远程URL导致白屏

**日期**: 2026-05-28
**严重程度**: 🔴 致命
**状态**: ✅ 已修复

### 问题描述
App启动后白屏，无网络时完全无法使用。

### 根本原因
`capacitor.config.ts` 中配置了 `server.url: 'https://fitness-buddy-platform.vercel.app'`，
Capacitor从远程URL加载而非本地 `dist/` 资源。无网络 = 白屏。

### 修复方案
移除 `server.url`，让Capacitor从本地 `webDir: 'dist'` 加载构建产物。

### 预防措施
- ⚠️ Capacitor原生App必须加载本地资源，不要用远程URL
- ⚠️ 部署前运行 `npx cap sync` 确认资源同步
- ⚠️ 断网测试验证App基本功能

---

## 🐛 Bug #8: 5个组件孤立未使用

**日期**: 2026-05-28
**严重程度**: 🟡 中
**状态**: ✅ 已修复

### 问题描述
`Navbar`、`HeroBanner`、`ActivityCard`、`CommunityPostCard`、`UserCard` 五个组件
存在于代码库但从未在 App.tsx 中引用，功能无法触达。

### 修复方案
- 新建 `CommunityPage.tsx` 整合 HeroBanner、ActivityCard、CommunityPostCard、UserCard
- 新建 `communityData.ts` 提供社区Mock数据
- App.tsx 新增 `community` tab，5-tab导航完整覆盖

---

## 🐛 Bug #9: Sidebar"数据报告"按钮无响应

**日期**: 2026-05-28
**严重程度**: 🟡 中
**状态**: ✅ 已修复

### 问题描述
Sidebar底部"数据报告"按钮 `onClick={() => {}}` 是空函数，点击无反应。

### 修复方案
新增 `onNavigateToDashboard` prop，按钮点击切换到 dashboard tab。

---

## 🐛 Bug #10: Record/Profile Tab无内容

**日期**: 2026-05-28
**严重程度**: 🟡 中
**状态**: ✅ 已修复

### 问题描述
"记录"和"我的" Tab只显示占位文字，无实际功能。

### 修复方案
- 新建 `RecordPage.tsx`：体重记录(含图表)、饮食记录、运动记录，三个子Tab
- 新建 `ProfilePage.tsx`：用户资料、减脂目标进度、成就徽章、今日概览、设置菜单
- 均使用 `mockData.ts` 中已有数据

---

## 🐛 Bug #11: 离线时AI对话崩溃

**日期**: 2026-05-28
**严重程度**: 🟡 中
**状态**: ✅ 已修复

### 问题描述
无网络时发送消息，`chatService` 抛出异常，前端显示错误。

### 修复方案
- 检查 `navigator.onLine`，离线时直接走fallback
- API调用外层 try-catch，失败时返回上下文相关的离线回复
- 离线回复模拟流式输出效果（逐字显示）

---

## 🐛 Bug #12: 体重变化对比索引错误

**日期**: 2026-05-28
**严重程度**: 🟡 中
**状态**: ✅ 已修复

### 问题描述
RecordPage中体重历史列表的对比逻辑 `mockWeightRecords[length - 1 - i + 1]` 索引计算错误，
导致显示的增减数据不正确。

### 修复方案
使用 `.slice().reverse().map((record, i, arr) => arr[i-1])` 简化对比逻辑。

---

## 🐛 Bug #13: ProfilePage进度条公式不一致

**日期**: 2026-05-28
**严重程度**: 🟢 低
**状态**: ✅ 已修复

### 问题描述
ProfilePage进度条使用 `(weight - targetWeight) / (weight * 0.1)` 公式，
与DataDashboard的 `(weight - targetWeight) / (startWeight - targetWeight)` 不一致。

### 修复方案
统一使用 `startWeight - targetWeight` 作为分母。

---

## 📊 常见问题模式总结

### 1. TypeScript类型问题
- **模式**: 缺少类型定义、未使用的导入、隐式any
- **预防**: 启用严格模式、运行lint检查、添加类型注解

### 2. 代码同步问题
- **模式**: GitHub与本地代码不一致
- **预防**: 修改后立即提交、使用git管理、定期检查状态

### 3. 组件依赖问题
- **模式**: 组件引用不存在的导出
- **预防**: 检查所有import语句、验证导出存在、运行构建测试

### 4. 框架版本不匹配
- **模式**: 配置文件与实际使用的框架版本不一致
- **预防**: 升级依赖时同步更新配置、查阅官方升级指南

---

## 🔧 排查清单

当遇到构建错误时，按顺序检查：

1. ✅ 运行 `npm run build` 本地验证
2. ✅ 检查所有import语句的导出是否存在
3. ✅ 验证TypeScript类型定义完整
4. ✅ 确认GitHub代码是最新的
5. ✅ 检查package.json依赖是否正确
6. ✅ 查看vercel.json配置是否正确
7. ✅ 验证框架版本语法（如Tailwind CSS v3 vs v4）

---

## 📝 提交检查清单（必做）

在提交代码到GitHub之前，必须完成：

1. **本地构建测试**
   ```bash
   npm run build
   ```

2. **Git状态检查**
   ```bash
   git status
   ```

3. **代码同步确认**
   - 确认所有修改的文件都已提交
   - 确认GitHub上的文件是最新的

4. **查看BUG_HISTORY.md**
   - 如果遇到新问题，记录到文档中
   - 验证不是历史bug的重复

---

## 📝 更新日志
- 2026-05-27: 创建Bug历史文档
- 2026-05-27: 添加Bug #1-5的记录
- 2026-05-27: 添加Bug #6（Tailwind CSS版本语法不匹配）
- 2026-05-27: 添加"提交检查清单"章节
- 2026-05-28: 添加Bug #7-13（白屏、孤立组件、Sidebar死按钮、Tab无内容、离线崩溃、索引错误、公式不一致）
