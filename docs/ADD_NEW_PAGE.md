# 添加新页面指南

本文档提供在管理界面添加新页面的完整检查清单。

---

## 前提条件

- [ ] 确认页面需求明确
- [ ] 设计页面路由路径（如 `/new-feature`）
- [ ] 设计导航标签名称（中文 + 英文简写）
- [ ] 选择合适的图标（FontAwesome）

---

## 步骤1: 创建页面组件

### 1.1 创建Vue文件

```bash
# 位置: web/admin-spa/src/views/
touch web/admin-spa/src/views/NewFeatureView.vue
```

### 1.2 基础组件模板

```vue
<template>
  <div class="new-feature-container">
    <div class="card p-4 sm:p-6">
      <!-- 页面标题 -->
      <div class="mb-4 sm:mb-6">
        <h3 class="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100 sm:mb-2 sm:text-xl">
          新功能标题
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          功能描述
        </p>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="py-12 text-center">
        <div class="loading-spinner mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400">加载中...</p>
      </div>

      <!-- 内容区域 -->
      <div v-else>
        <!-- 你的页面内容 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiClient } from '@/config/api'
import { showToast } from '@/utils/toast'

const loading = ref(false)

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // API调用
  } catch (error) {
    console.error('Failed to load:', error)
    showToast('加载失败', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.new-feature-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
```

---

## 步骤2: 添加路由配置

### 2.1 修改 `web/admin-spa/src/router/index.js`

**位置1: 导入组件（约第6-20行）**

```javascript
// 在其他View导入后添加
const NewFeatureView = () => import('@/views/NewFeatureView.vue')
```

**位置2: 添加路由定义（约第150-170行，在user-management之前或之后）**

```javascript
{
  path: '/new-feature',
  component: MainLayout,
  meta: { requiresAuth: true },  // 需要认证
  children: [
    {
      path: '',
      name: 'NewFeature',  // 注意：首字母大写，驼峰命名
      component: NewFeatureView
    }
  ]
}
```

**注意事项**:
- ✅ `path` 使用小写 + 连字符（`/new-feature`）
- ✅ `name` 使用大驼峰（`NewFeature`）
- ✅ 必须设置 `meta: { requiresAuth: true }` 确保需要登录
- ✅ 使用 MainLayout 包裹（保持导航栏）

---

## 步骤3: 添加导航标签

### 3.1 修改 `web/admin-spa/src/components/layout/TabBar.vue`

**位置: baseTabs.push(...) 数组（约第72-76行）**

```javascript
baseTabs.push(
  { key: 'tutorial', name: '使用教程', shortName: '教程', icon: 'fas fa-graduation-cap' },
  { key: 'prompts', name: 'Prompts 管理', shortName: 'Prompts', icon: 'fas fa-comment-dots' },
  { key: 'newFeature', name: '新功能', shortName: '新功能', icon: 'fas fa-star' },  // 👈 添加这里
  { key: 'settings', name: '系统设置', shortName: '设置', icon: 'fas fa-cogs' }
)
```

**字段说明**:
- `key`: 小驼峰命名，与路由映射对应
- `name`: 完整名称（桌面端显示）
- `shortName`: 简短名称（移动端显示）
- `icon`: FontAwesome图标类名

**图标参考**: https://fontawesome.com/icons

---

## 步骤4: 添加路由映射

### 4.1 修改 `web/admin-spa/src/components/layout/MainLayout.vue`

**位置1: tabRouteMap 定义（约第38-45行）**

```javascript
const tabRouteMap = computed(() => {
  const baseMap = {
    dashboard: '/dashboard',
    apiKeys: '/api-keys',
    accounts: '/accounts',
    tutorial: '/tutorial',
    prompts: '/prompts',
    newFeature: '/new-feature',  // 👈 添加这里（注意小驼峰）
    settings: '/settings'
  }
  // ...
})
```

**位置2: 第一处 nameToTabMap（约第66-74行）**

```javascript
const nameToTabMap = {
  Dashboard: 'dashboard',
  ApiKeys: 'apiKeys',
  Accounts: 'accounts',
  UserManagement: 'userManagement',
  Tutorial: 'tutorial',
  Prompts: 'prompts',
  NewFeature: 'newFeature',  // 👈 添加这里（注意大驼峰→小驼峰）
  Settings: 'settings'
}
```

**位置3: 第二处 nameToTabMap（约第95-103行）**

```javascript
const nameToTabMap = {
  Dashboard: 'dashboard',
  ApiKeys: 'apiKeys',
  Accounts: 'accounts',
  UserManagement: 'userManagement',
  Tutorial: 'tutorial',
  Prompts: 'prompts',
  NewFeature: 'newFeature',  // 👈 添加这里（与位置2相同）
  Settings: 'settings'
}
```

**关键要点**:
- ⚠️ **必须添加2次** nameToTabMap（MainLayout.vue中有2处）
- ✅ 键名使用大驼峰（与 router name 一致）
- ✅ 值使用小驼峰（与 TabBar key 一致）

---

## 步骤5: 后端API（如需要）

### 5.1 创建后端路由文件

```bash
# 位置: src/routes/admin/
touch src/routes/admin/newFeature.js
```

### 5.2 路由模板

```javascript
const express = require('express')
const router = express.Router()
const { authenticateAdmin } = require('../../middleware/auth')
const logger = require('../../utils/logger')

// GET /admin/new-feature
router.get('/new-feature', authenticateAdmin, async (req, res) => {
  try {
    // 处理逻辑
    res.json({ success: true, data: {} })
  } catch (error) {
    logger.error('Failed to get new feature:', error)
    res.status(500).json({ error: 'Failed to get new feature' })
  }
})

module.exports = router
```

### 5.3 注册路由到 `src/routes/admin/index.js`

**位置1: 导入（约第27行）**

```javascript
const newFeatureRoutes = require('./newFeature')
```

**位置2: 挂载（约第44行）**

```javascript
router.use('/', newFeatureRoutes)
```

---

## 步骤6: 验证清单

### 6.1 代码验证

- [ ] ✅ NewFeatureView.vue 文件已创建
- [ ] ✅ router/index.js 已添加导入（1处）
- [ ] ✅ router/index.js 已添加路由定义（1处）
- [ ] ✅ TabBar.vue 已添加导航标签（1处）
- [ ] ✅ MainLayout.vue 已添加 tabRouteMap（1处）
- [ ] ✅ MainLayout.vue 已添加 nameToTabMap（2处）
- [ ] ✅ 后端路由已创建（如需要）
- [ ] ✅ 后端路由已注册（如需要）

### 6.2 功能验证

- [ ] ✅ 运行前端: `cd web/admin-spa && npm run dev`
- [ ] ✅ 访问页面: `http://localhost:5173/new-feature`
- [ ] ✅ 导航标签显示正确
- [ ] ✅ 点击导航标签跳转正确
- [ ] ✅ 页面内容正常加载
- [ ] ✅ 暗黑模式兼容
- [ ] ✅ 移动端响应式布局

### 6.3 自动化验证

```bash
# 运行审计脚本
cd /e/CodeProgram/claude-relay-service
node .audit-routes-251.js  # 验证路由完整性
```

---

## 步骤7: 更新文档

### 7.1 更新 CHANGELOG.md

```markdown
## [2.0.X] - YYYY-MM-DD

### Added

- **新增**: 新功能页面
  - 添加 `/new-feature` 路由和导航
  - 实现 XXX 功能
  - 影响文件：`router/index.js`、`TabBar.vue`、`MainLayout.vue`、`NewFeatureView.vue`
```

### 7.2 更新 README（如需要）

如果是重要功能，更新主README的功能列表。

---

## 常见陷阱 ⚠️

### 陷阱1: 忘记添加2处 nameToTabMap
**症状**: 页面可以直接访问，但导航标签不会高亮
**解决**: 检查 MainLayout.vue 两处 nameToTabMap 是否都添加

### 陷阱2: 路由名称大小写不一致
**症状**: 导航跳转失败或标签不激活
**解决**:
- router name: `NewFeature` (大驼峰)
- TabBar key: `newFeature` (小驼峰)
- nameToTabMap: `NewFeature: 'newFeature'`

### 陷阱3: 忘记配置认证
**症状**: 未登录也能访问页面
**解决**: 确保 `meta: { requiresAuth: true }`

### 陷阱4: 图标不显示
**症状**: 导航标签没有图标
**解决**: 检查图标类名是否正确（`fas fa-xxx`）

### 陷阱5: 暗黑模式样式缺失
**症状**: 暗黑模式下显示异常
**解决**: 所有颜色都要添加 `dark:` 前缀变体

---

## 快速检查命令

```bash
# 检查文件是否存在
ls web/admin-spa/src/views/NewFeatureView.vue

# 搜索配置是否添加
grep -n "newFeature" web/admin-spa/src/router/index.js
grep -n "newFeature" web/admin-spa/src/components/layout/TabBar.vue
grep -n "newFeature" web/admin-spa/src/components/layout/MainLayout.vue

# 统计配置次数（应该是：router 2次，TabBar 1次，MainLayout 3次）
grep -c "newFeature" web/admin-spa/src/router/index.js      # 应显示 2
grep -c "newFeature" web/admin-spa/src/components/layout/TabBar.vue  # 应显示 1
grep -c "newFeature" web/admin-spa/src/components/layout/MainLayout.vue  # 应显示 3
```

---

## 参考示例

查看以下页面的实现作为参考：
- **简单页面**: `TutorialView.vue`
- **复杂页面**: `PromptsView.vue`
- **表格页面**: `AccountsView.vue`
- **表单页面**: `SettingsView.vue`

---

## 获取帮助

如有问题：
1. 查看审计报告: `.audit-report-v2.0.51.md`
2. 查看技术债文档: `docs/TECH_DEBT.md`
3. 查看现有页面实现作为参考

---

**最后更新**: 2025-12-25
**适用版本**: v2.0.51+
