# 合并上游 v1.1.211

## 合并信息
- **日期**: 2025-11-27
- **上游版本**: v1.1.207 - v1.1.211
- **本地版本**: v2.0.25 → v2.0.26
- **合并策略**: 完整合并（Plan A）

## 主要更改

### 1. Gemini 架构重构 ✅
**文件变更**:
- 新增: `src/handlers/geminiHandlers.js` (2308行)
- 精简: `src/routes/geminiRoutes.js` (1497行 → 108行)
- 精简: `src/routes/standardGeminiRoutes.js` (1250行 → 218行)

**影响**:
- 将 2600+ 行重复代码提取到独立的 handler 模块
- 提高代码可维护性
- 减少重复代码

### 2. API Keys 页面性能优化 ✅
**文件变更**:
- 新增: `src/services/accountNameCacheService.js`
- 修改: `web/admin-spa/src/views/ApiKeysView.vue`
- 修改: `src/routes/admin.js`

**影响**:
- 新增账户名称缓存服务，提升页面加载速度
- 优化大量 API Key 场景下的性能

### 3. Claude 新接口适配 ✅
**文件变更**:
- 修改: `src/services/claudeRelayService.js`

**改动**:
- 移除 `x-authorization` 头，适配 Claude 新 usage 接口

### 4. Web UI Bug 修复 ✅
**修复列表**:
- API Keys 页面状态排序失效问题
- API Keys 页面窗口限制显示错误
- 复制完整 Claude 配置按钮增加 export
- API Stats 查询被禁用 key 增加名字显示
- Gemini OAuth 账户 projectId 降级逻辑

## 冲突解决

### 处理的冲突文件
1. **VERSION**: 保持本地版本号 v2.0.26
2. **src/routes/geminiRoutes.js**: 接受上游重构
3. **src/routes/standardGeminiRoutes.js**: 接受上游重构

### 冲突解决原则
- 完全接受上游的 Gemini 重构
- 保持我们的版本号体系
- 无自定义修改需要保留

## 测试验证

### 模块加载测试
- ✅ geminiRoutes.js 加载成功
- ✅ standardGeminiRoutes.js 加载成功
- ✅ 新增 geminiHandlers.js 正确创建

### 功能影响评估
- **Gemini 功能**: 需完整测试，架构重构影响较大
- **API Keys 管理**: 需验证性能提升效果
- **Claude 转发**: 需验证新接口兼容性
- **Web UI**: 需验证各项 bug 修复

## 后续建议

1. **全面测试 Gemini 功能**
   - OAuth 账户登录和使用
   - API Key 账户功能
   - 流式和非流式响应
   - projectId 处理逻辑

2. **性能监控**
   - 监控 API Keys 页面加载时间
   - 验证缓存服务效果

3. **生产环境部署建议**
   - 先在测试环境充分验证
   - 准备回滚方案
   - 监控错误日志

## 提交信息

```
chore: merge upstream v1.1.207-211 into v2.0.26

完整合并上游 v1.1.207 至 v1.1.211 的所有更改：

重要更改：
1. Gemini 重构 - 接受上游将实现代码提取到 handlers/geminiHandlers.js
2. API Keys页面性能优化 - 新增 accountNameCacheService 缓存层
3. Claude 新 usage 接口适配
4. 多项 Web UI bug 修复

具体更改：
- refactor: 重构 Gemini 路由，将2600+行代码提取到独立handler
- feat: 新增 accountNameCacheService 提升 API Keys 页面加载速度
- fix: Claude 转发移除 x-authorization 头
- fix: API Keys 页面状态排序失效问题
- fix: API Keys 页面窗口限制显示错误
- fix: API Stats 查询被禁用 key 增加名字显示
- fix: 复制完整 Claude 配置按钮增加 export
- fix: Gemini OAuth 账户 projectId 降级逻辑

🔀 Merged with upstream/main (v1.1.211)
```

## 风险评估

### 高风险
- **Gemini 架构重构**: 大规模代码重构，需充分测试

### 中风险
- **缓存服务**: 新增服务，需验证内存使用和缓存一致性

### 低风险
- **UI Bug 修复**: 局部修复，影响范围小
- **Claude 接口调整**: 简单的头部移除

## 版本对照

| 组件 | 上游版本 | 本地版本 |
|------|---------|----------|
| 主版本 | v1.1.211 | v2.0.26 |
| Gemini Handler | 新增 | 新增 |
| 账户名缓存 | 新增 | 新增 |
| Web UI | 修复多个bug | 同步修复 |