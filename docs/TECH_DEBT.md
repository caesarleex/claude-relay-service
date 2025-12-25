# 技术债清单

本文档记录项目中已识别的技术债，按优先级排序。

---

## P3 - 低优先级（下次大改时处理）

### TD-001: 导航配置数据结构重复定义

**发现日期**: 2025-12-25
**发现版本**: v2.0.51
**影响范围**: 前端维护性

#### 问题描述

导航相关配置分散在3个文件、6个位置定义，缺少"单一数据源"（Single Source of Truth）：

1. **TabBar.vue** (line 56-79):
   - `tabs` 数组定义（包含key、name、icon等）

2. **MainLayout.vue** (line 38-45):
   - `tabRouteMap` 对象定义（key → route映射）

3. **MainLayout.vue** (line 66-74, 95-103):
   - `nameToTabMap` 对象定义了**2次**（routeName → tabKey映射）

4. **router/index.js**:
   - 实际路由定义

#### 当前影响

添加新页面需要手动修改：
- [ ] TabBar.vue: 添加tab配置（1处）
- [ ] MainLayout.vue: 添加tabRouteMap（1处）
- [ ] MainLayout.vue: 添加nameToTabMap（2处）
- [ ] router/index.js: 添加路由导入和定义（2处）

**总计**: 3个文件，6个位置

#### 理想设计

```javascript
// config/navigation.js - 单一数据源
export const NAVIGATION_CONFIG = [
  {
    key: 'dashboard',
    name: '仪表板',
    shortName: '仪表板',
    route: '/dashboard',
    routeName: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
    component: () => import('@/views/DashboardView.vue')
  },
  {
    key: 'prompts',
    name: 'Prompts 管理',
    shortName: 'Prompts',
    route: '/prompts',
    routeName: 'Prompts',
    icon: 'fas fa-comment-dots',
    component: () => import('@/views/PromptsView.vue')
  },
  // ...条件路由
  {
    key: 'userManagement',
    name: '用户管理',
    shortName: '用户',
    route: '/user-management',
    routeName: 'UserManagement',
    icon: 'fas fa-users',
    component: () => import('@/views/UserManagementView.vue'),
    condition: (authStore) => authStore.oemSettings?.ldapEnabled
  }
]

// 自动生成：
// - TabBar.vue 的 tabs
// - MainLayout.vue 的 tabRouteMap 和 nameToTabMap
// - router/index.js 的路由定义
```

#### 实用主义评估

| 维度 | 评估 |
|------|------|
| 添加新页面频率 | 低（约6个月1次） |
| 重构风险 | 中等（需测试3个组件） |
| 当前代码清晰度 | 高（虽重复但直观） |
| 维护成本 | 中等（需记住6个位置） |

**Linus式判断**:
> "Talk is cheap. Show me the code."
> 当前修复已解决实际问题。重构虽理论上更好，但需要评估收益vs风险。
> 先记录技术债，等下次大改时再优化。

#### 推荐修复时机

- ✅ **下次大改前端架构时**（如TypeScript迁移、重构状态管理）
- ✅ **团队规模扩大时**（多人协作更需要单一数据源）
- ❌ **不推荐单独修复**（收益 < 风险 + 成本）

#### 修复计划

1. 创建 `web/admin-spa/src/config/navigation.js`
2. 定义 `NAVIGATION_CONFIG` 数组
3. 重构 TabBar.vue 从配置生成tabs
4. 重构 MainLayout.vue 从配置生成映射
5. 可选：重构 router/index.js 从配置生成路由
6. 添加单元测试验证配置完整性
7. 更新 `docs/ADD_NEW_PAGE.md` 文档

#### 相关文档

- 审计报告: `.audit-report-v2.0.51.md`
- 新页面添加指南: `docs/ADD_NEW_PAGE.md`

---

## 文档说明

- **优先级定义**:
  - P0: 严重bug，立即修复
  - P1: 重要问题，本周修复
  - P2: 中等问题，本月修复
  - P3: 低优先级，下次大改时处理
  - P4: 可选优化，视情况处理

- **更新流程**:
  1. 发现新技术债 → 添加到本文档
  2. 修复技术债 → 标记为已解决并保留记录
  3. 定期审查（每季度）→ 调整优先级

- **负责人**: 项目维护者

---

**最后更新**: 2025-12-25
**总计技术债**: 1 项（P3: 1项）
