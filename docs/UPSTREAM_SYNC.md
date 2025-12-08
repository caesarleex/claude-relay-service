# Upstream Sync History

本文档记录从上游仓库 (Wei-Shaw/claude-relay-service) 合并的变更历史。

**上游仓库**: https://github.com/Wei-Shaw/claude-relay-service.git

---

## [v1.1.225-226] - 2025-12-08

**合并到**: v2.0.37

### Added (v1.1.225)

- 并发管理 API ✅
  - 新增 `concurrency.js` 路由
  - 新增 `GET/DELETE /admin/concurrency` 端点
  - 新增 Redis 并发管理函数 (+240行)
  - 影响文件：`concurrency.js`、`redis.js`、`admin/index.js`

- 并发租约保护 ✅
  - 最大生存时间限制（默认10分钟）
  - try-catch 防止并发泄漏
  - 影响文件：`auth.js`

- Droid 增强 ✅
  - 自定义 User-Agent 支持
  - 动态 x-api-provider（-max 用 openai）
  - OpenAI 格式 cache token 捕获
  - User-Agent 更新至 0.32.1
  - 影响文件：`droidRelayService.js`、`droidAccountService.js`、`AccountForm.vue`

- Docker 构建优化 ✅
  - 后端依赖与前端构建并行
  - BuildKit 缓存加速
  - 影响文件：`Dockerfile`

### Fixed (v1.1.226)

- API Keys 窗口费率显示修复 ✅
  - rateLimitWindow 显式转换为整数
  - 影响文件：`apiKeys.js`

### Technical

- **合并方式**: 混合（7文件直接采用 + 3文件手动合并）
- **变更量**: +548/-23 lines, 11 files
- **手动合并文件**:
  - `admin/index.js`: 保留 promptsRoutes + 添加 concurrencyRoutes
  - `droidRelayService.js`: 保留 promptLoader + 添加新功能
  - `api.js`: 保留 Client disconnected 处理 + 改用黑名单模式

---

## [v1.1.224] - 2025-12-07

**合并到**: v2.0.36

### Added

- API Keys 模型筛选功能 ✅
  - 新增 `GET /admin/api-keys/used-models` 端点
  - 新增 `getKeyIdsWithModels()` 和 `getAllUsedModels()` Redis 函数
  - CustomDropdown 组件支持多选模式
  - 影响文件：`redis.js`、`apiKeys.js`、`CustomDropdown.vue`、`ApiKeysView.vue`

### Technical

- **合并方式**: 直接采用上游版本（无冲突）
- **变更量**: +221/-18 lines, 5 files

---

## [v1.1.223] - 2025-12-06

**合并到**: v2.0.35

### Added

- Pro 账户支持 Opus 4.5+ 模型 ✅
  - 新增 `isOpus45OrNewer()` 模型版本检测
  - 新增 `isProAccount()` 账户类型检测
  - Pro 账号支持 Opus 4.5+，不支持历史版本
  - 影响文件：`modelHelper.js`、`claudeAccountService.js`、`unifiedClaudeScheduler.js`

- 上游不稳定错误检测与账户临时不可用机制 ✅
  - 新增 `unstableUpstreamHelper.js`
  - 5xx 错误自动标记账户临时不可用（5分钟 TTL）
  - 影响文件：`claudeRelayService.js`、`unifiedClaudeScheduler.js`

- 账户使用记录时间线 ✅
  - 新增 `/admin/accounts/:accountId/usage-records` 端点
  - 新增 `AccountUsageRecordsView.vue` 页面
  - 影响文件：`usageStats.js`、`router/index.js`、`AccountsView.vue`

### Fixed

- 模型限制改为黑名单模式 ✅
  - 原：白名单（仅允许列表中的模型）
  - 新：黑名单（禁止列表中的模型）
  - 影响文件：`openaiClaudeRoutes.js`、`openaiRoutes.js`

- ActionDropdown 和 CustomDropdown 改进 ✅
  - 优化下拉菜单位置计算
  - 支持层级结构显示

### Technical

- **合并方式**: 手动合并（保留原创功能）
- **变更量**: ~2000 行
- **保留的原创功能**:
  - promptLoader 及 P0/P1/P2/P3 优先级系统
  - app.js 中的 promptLoader 初始化
  - admin/index.js 中的 prompts 路由
  - SettingsView.vue 中的 Prompts 管理 Tab
- **排除文件**: `package.json`（保留我们的 express ^5 和 multer）

---

## [v1.1.221 - v1.1.222] - 2025-12-05

**合并到**: v2.0.34

### Added

- API Key 使用记录时间线功能 (92b30e19, 9fe2918a, 6a3dce52) ✅
  - 新增 API Key 使用记录查看页面
  - 新增使用记录详情弹窗
  - 新增后端 API 端点
  - 新增前端路由

### Fixed

- 修复 Gemini handlers ProxyAgent 调用方式 (b61e1062) ✅
  - 实例方法改为静态方法调用
  - `new ProxyHelper().createProxyAgent()` → `ProxyHelper.createProxyAgent()`

- 修复 Dashboard 趋势图表和日期过滤器 (95ef04c1, 4919e392) ✅
  - 日期过滤器显示问题
  - 趋势图表数据渲染

- Modal 弹窗定位和 ESLint 修复 (354d8da1, 3df0c7c6) ✅
  - UsageDetailModal 定位优化
  - no-shadow 规则修复

### Technical

- **Cherry-pick 提交**: 8 个（成功）
- **变更量**: ~600 行
- **影响文件**: 11 个
  - `src/handlers/geminiHandlers.js`
  - `src/routes/admin/usageStats.js`
  - `src/routes/admin/utils.js`
  - `web/admin-spa/src/components/apikeys/RecordDetailModal.vue` (新增)
  - `web/admin-spa/src/components/apikeys/UsageDetailModal.vue`
  - `web/admin-spa/src/router/index.js`
  - `web/admin-spa/src/stores/dashboard.js`
  - `web/admin-spa/src/views/ApiKeyUsageRecordsView.vue` (新增)
  - `web/admin-spa/src/views/ApiKeysView.vue`
  - `web/admin-spa/src/views/DashboardView.vue`
- **排除文件**: `pnpm-lock.yaml`（我们使用 npm）

---

## [v1.1.220] - 2025-12-04

**合并到**: v2.0.33

### Added

- Claude Console 账户自动防护禁用开关 (8aca1f9d) ✅
  - 新增 `disableAutoProtection` 配置项
  - 启用后 401/400/429/529 错误不再自动禁用账户
  - 错误仍记录日志并透传给客户端
  - 前端新增复选框配置

### Technical

- **Cherry-pick 提交**: 1 个（成功）
- **变更量**: +148/-22 行
- **影响文件**: 4 个
  - `src/services/claudeConsoleAccountService.js`
  - `src/services/claudeConsoleRelayService.js`
  - `src/routes/admin/claudeConsoleAccounts.js`
  - `web/admin-spa/src/components/accounts/AccountForm.vue`
- **排除文件**: `pnpm-lock.yaml`（我们使用 npm）

---

## [v1.1.219] - 2025-12-04

**合并到**: v2.0.32

### Added

- 账户列表排序支持正序/倒序切换 (9ad5c85c) ✅
  - 前端 `AccountsView.vue` 增强
  - 统一下拉框和表格标题排序变量
  - 动态更新排序图标

### Fixed

- 过滤 Cloudflare CDN headers 以防止 API 安全检查 (5fd78b64) ✅
  - 新增 `src/utils/headerFilter.js` 工具类
  - 过滤 13 个 Cloudflare CDN headers
  - 重构 `claudeRelayService.js` 和 `openaiResponsesRelayService.js` 的 header 过滤逻辑
  - 解决 Cloudflare 橙色云模式下上游 API 403 问题

### Technical

- **Cherry-pick 提交**: 2 个（成功）
- **变更量**: +183/-103 行
- **影响文件**: 4 个
  - `src/utils/headerFilter.js` (新增)
  - `src/services/claudeRelayService.js`
  - `src/services/openaiResponsesRelayService.js`
  - `web/admin-spa/src/views/AccountsView.vue`

---

## [v1.1.218] - 2025-12-02

**合并到**: v2.0.31

### Added

- 支持 sessionKey (Cookie) 自动完成 OAuth 授权 (81e89d2d) ✅
  - 新增 `COOKIE_OAUTH_CONFIG` 配置常量
  - 新增 `buildCookieHeaders()` 构建带 Cookie 的请求头
  - 新增 `getOrganizationInfo()` 获取组织 UUID 和能力列表
  - 新增 `authorizeWithCookie()` 使用 Cookie 获取授权 code
  - 新增 `oauthWithCookie()` 完整的 Cookie 授权流程
  - 新增 API 端点：`POST /admin/claude-accounts/oauth-with-cookie`
  - 新增 API 端点：`POST /admin/claude-accounts/setup-token-with-cookie`
  - 前端支持授权方式选择（手动/Cookie 自动）
  - 前端支持批量 sessionKey 输入和处理
  - 前端增加 sessionKey 获取帮助说明

### Technical

- **Cherry-pick 提交**: 1 个（成功）
- **变更量**: +1145/-107 行
- **影响文件**: 5 个
  - `src/utils/oauthHelper.js`
  - `src/routes/admin/claudeAccounts.js`
  - `web/admin-spa/src/components/accounts/AccountForm.vue`
  - `web/admin-spa/src/components/accounts/OAuthFlow.vue`
  - `web/admin-spa/src/stores/accounts.js`

---

## [v1.1.215 - v1.1.217] - 2025-12-02

**合并到**: v2.0.30

### Fixed

- 修复 Claude API 400 错误：tool_result/tool_use 不匹配问题 (249e2563) ✅
  - `_enforceCacheControlLimit()` 从删除整个内容块改为只删除 `cache_control` 属性
  - 避免删除 tool_use 导致 400 错误
  - 避免删除用户消息导致上下文丢失
- 调整 Gemini-API BaseApi 后缀以适配更多端点 (dfee7be9) ✅
  - 新增 `buildGeminiApiUrl()` 工具函数
  - 兼容新旧 baseUrl 格式（以 `/models` 结尾 vs 不以 `/models` 结尾）

### Added

- Console 账号 count_tokens 端点判断 (02018e10) ✅
  - 自动检测并标记不可用的端点
  - Fallback 响应机制：返回 `{ input_tokens: 0 }`
  - 新增方法：`markCountTokensUnavailable()`、`isCountTokensUnavailable()`、`removeCountTokensUnavailable()`

### Changed

- 优化表格布局 (d3155b82) ✅
  - `AccountsView.vue` 和 `ApiKeysView.vue` 布局改进

### Rejected

- **增强 console 账号 test 端点 (e8e6f972)** ❌
  - **拒绝理由**: 上游改动删除 `promptLoader` 引用和 P0/P1/P2/P3 优先级系统
  - **影响**:
    - 删除 `const promptLoader = require('./promptLoader')`
    - 删除配置化的优先级系统（Line 561-618）
    - 引入硬编码：`this.claudeCodeSystemPrompt = "You are Claude Code..."`
    - 删除我们在 v2.0.29 的 230+ 行独立实现
    - 新增硬编码文件：`src/utils/testPayloadHelper.js`
  - **决策**: 保持 v2.0.29 实现
    - 我们的实现使用 `promptLoader`（零硬编码）
    - 我们有完整的 P0/P1/P2/P3 优先级系统
    - 架构更优，可配置化程度更高

### Technical

- **Cherry-pick 提交**: 4 个（成功）
- **拒绝提交**: 1 个（e8e6f972，架构冲突）
- **版本跨度**: v1.1.215、v1.1.216、v1.1.217

---

## [v1.1.214] - 2025-11-29

**合并到**: v2.0.29

### Fixed

- 修复 Gemini-API 账户共享池无法调度问题 (63a7c251)
  - 新增 `_isActive()` 辅助方法，兼容 `boolean` 和 `string` 类型
- 修复 Gemini-API 账户分组调度设置不生效的问题 (d89344ad)
  - 支持多分组模式 (`groupIds` 数组)
  - 保持单分组向后兼容 (`groupId`)
- 修复 OpenAI-API 账户分组调度设置问题 (326adaae)
  - OpenAI Scheduler 同时支持 `openai` 和 `openai-responses` 账户类型
- 修复 Claude Console 账号 Test 未响应的 bug (6ec4f4bf)
  - 重写 `testAccountConnection` 方法，独立处理以隔离副作用
  - **我们的改进**: 使用 `promptLoader` 替代硬编码 system prompt

### Changed

- 优化表格显示固定列宽 (68f00397)
  - 新增 `ActionDropdown.vue` 组件
  - `AccountsView.vue` 使用 sticky 列和固定宽度
  - `ApiKeysView.vue` 同步改进

### Technical

- **Cherry-pick 提交**: 5 个
- **我们的额外改进**:
  - `claudeRelayService.js`: 同步重写 `testAccountConnection` 方法（上游未修复）
  - 使用 `promptLoader.getPrompt('claudeCode')` 替代硬编码

---

## [v1.1.212 - v1.1.213] - 2025-11-28

**合并到**: v2.0.28

### Changed

- **架构重构**: admin.js 模块化（fd2b8a01）
  - 将 9916 行单文件拆分为 18 个模块
  - 新增 `src/routes/admin/` 目录结构
  - 我们额外创建 `prompts.js` 保留原创功能

### Added

- **requestIdentityService** (49645e8a): Claude 请求身份转换
  - Stainless 指纹管理
  - User ID 规范化
  - 替换 runtimeAddon
- **costRankService** (28caa93d): API Key 费用排序功能
- **账户测试功能** (7db70e2d): Claude/Console 账户在线测试
- **API Key 测试功能** (b58b8b1a): 支持 Claude 端点测试

### Fixed

- 修复 Gemini API 账户转发的传参问题 (4a0ba6ed)
- 修复 Gemini API 类型账户绑定显示问题 (53553c7e)
- 修复 API Key 窗口限制时间显示异常 (d9476230)
- Droid 增加 comm 端点支持 (4aeb4706)

### Technical

- **Cherry-pick 提交**: 8 个
- **新增模块**:
  - `src/routes/admin/` (18 个模块)
  - `src/routes/admin/prompts.js` (我们的原创)
  - `src/services/requestIdentityService.js`
  - `src/services/costRankService.js`
  - `web/admin-spa/src/components/accounts/AccountTestModal.vue`
  - `web/admin-spa/src/components/apikeys/ApiKeyTestModal.vue`

---

## [v1.1.207 - v1.1.211] - 2025-11-27

**合并到**: v2.0.26

### Added

- **性能优化**: 新增 `accountNameCacheService` 缓存服务，大幅提升 API Keys 页面加载速度
- **文档**: 添加赞助二维码（支付宝/微信）

### Changed

- **架构重构**: Gemini 路由大规模重构
  - 将 2600+ 行代码提取到 `handlers/geminiHandlers.js`
  - `geminiRoutes.js` 精简 93%（1497行 → 108行）
  - `standardGeminiRoutes.js` 精简 83%（1250行 → 218行）
  - 消除大量重复代码，提高可维护性
- **Claude 适配**: 移除 `x-authorization` 头，适配新的 usage 接口
- **模型服务**: 优化模型信息获取逻辑

### Fixed

- 修复 API Keys 页面状态排序失效的问题
- 修复 API Keys 页面窗口限制显示错误的 bug
- 修复复制完整 Claude 配置按钮缺少 export 的问题
- 修复 API Stats 查询被禁用 key 时名字未显示的问题
- 修复 Gemini OAuth 账户 projectId 降级逻辑缺失的问题
- 修复 Gemini projectId fallback 机制，改为实时获取

### Technical

- **文件变更统计**: 22个文件，+4489行，-3519行
- **新增模块**:
  - `src/handlers/geminiHandlers.js` (2308行)
  - `src/services/accountNameCacheService.js` (286行)
- **测试状态**: 模块加载测试通过

---

## [v1.1.205 - v1.1.206] - 2025-11-26

**合并到**: v2.0.25

### Changed

- **速率限制**: 注释掉 429 错误自动标记账户限流的逻辑（与上游保持一致）
- **Gemini 修复**: 移除重复的 heartbeatTimer 声明

### Added

- **Gemini OAuth账户重置API**
  - `POST /gemini-accounts/:id/reset-rate-limit` - 重置限流状态
  - `POST /gemini-accounts/:id/reset-status` - 重置账户状态
- geminiAccountService 新增 `resetAccountStatus` 函数

---

## [v1.1.204] - 2025-11-24

**合并到**: v2.0.24

### Added

- Gemini API账户支持（使用API Key而非OAuth）
- 新增 `geminiApiAccountService.js` 管理API账户
- Gemini 3模型调用指南文档
- 改进速率限制处理（使用accountId代替account.id，更安全）

### Technical

- unifiedGeminiScheduler 支持 `allowApiAccounts` 选项
- 账户类型通过 `accountType` 字段区分（'gemini' 或 'gemini-api'）
- 账户选择逻辑增强：支持 if/else 分支处理不同账户类型
- 速率限制处理改进：动态选择 rateLimitAccountType
- 向后兼容：所有现有OAuth账户功能保持不变

---

## [v1.1.202 - v1.1.203] - 2025-11-23

**合并到**: v2.0.22

### v1.1.202 审计结果

- **数据结构**: 好品味（SSE 缓冲区管理符合协议规范）
- **复杂度**: 可接受（SSE 分块处理 40 行净增，修复真问题）
- **破坏性**: 零破坏性（向后兼容）
- **实用性**: 解决真实问题（429 处理、SSE 解析错误）
- **硬编码**: 通过（无硬编码）
- **连锁问题**: 通过（隔离在 Gemini 服务内）

### v1.1.203 审计结果

- **数据结构**: 好品味（Map 缓存，简洁高效）
- **复杂度**: 简洁（缓存逻辑清晰）
- **破坏性**: 零破坏性（默认关闭，Opt-in）
- **实用性**: 性能优化（减少连接开销）
- **硬编码**: 通过（配置驱动）

### Cherry-pick 结果

- 6f9ac4aa: 成功，自动合并 standardGeminiRoutes.js
- c33771ef: 成功，自动合并 standardGeminiRoutes.js
- c47bb729: 成功，自动合并 config/config.example.js 和 docker-compose.yml
- **零冲突**

### 影响文件

- `src/routes/geminiRoutes.js`: heartbeatTimer 清理位置变更
- `src/routes/standardGeminiRoutes.js`: 429 处理 + SSE 分块 + heartbeatTimer 变更
- `src/utils/proxyHelper.js`: Agent 缓存
- `config/config.example.js`: 代理配置
- `.env.example`: 代理配置
- `docker-compose.yml`: 环境变量

---

## [v1.1.200 - v1.1.201] - 2025-11-21

**合并到**: v2.0.21

### v1.1.201: Gemini 转发未响应修复

**上游Commit**: 823be8ac

**问题原因**:
同时设置 `httpAgent` 和 `httpsAgent` 导致 axios/follow-redirects 选择错误的协议，造成 Gemini 请求无响应。

**修复内容**:
- 删除不必要的 `httpAgent` 配置（目标 URL 均为 HTTPS）
- 只保留 `httpsAgent` 配置，避免协议选择错误

**影响文件**:
- `src/services/geminiAccountService.js`: 删除 6 处 `httpAgent` 设置
- `src/services/geminiRelayService.js`: 删除 3 处 `httpAgent` 设置

### v1.1.200: Codex compact 端点支持

**上游Commit**: 9b0a1f9b

**新功能**:
- 新增路由: `/responses/compact` 和 `/v1/responses/compact`
- 智能端点选择: 根据路由自动选择 standard 或 compact 端点
- store 参数适配: compact 请求自动删除 store 参数（避免 400 错误）

---

## [v1.1.195 - v1.1.199] - 2025-11-20

**合并到**: v2.0.20

### 1. 流式响应性能优化（geminiRoutes.js, standardGeminiRoutes.js）

**上游Commits**: 7cd59019, 87e03ced, 90e0c0ac

**问题背景**:
- 流式响应解析使用 `split('\n')` 产生额外字符串副本
- 流结束时的 usage 统计阻塞响应

**核心改进**:

```javascript
// 旧：字符串分割（产生临时数组）
const lines = buffer.split('\n')

// 新：indexOf + substring（零分配）
let newlineIndex
while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
  const line = buffer.substring(0, newlineIndex)
  buffer = buffer.substring(newlineIndex + 1)
}
```

### 2. SSE 心跳机制

**上游Commits**: d7358107, 5b22cb3e

**问题背景**:
- 代理服务器/负载均衡器对长时间无数据的 SSE 连接超时
- 用户感知为"无响应"或"连接断开"

**核心改进**:

```javascript
// 应用层心跳（每 15 秒）
const heartbeatTimer = setInterval(() => {
  if (!res.writableEnded) {
    res.write(': heartbeat\n\n')  // SSE 注释格式
  }
}, 15000)
```

### 3. 非阻塞响应结束

**上游Commit**: d7358107

**问题**：流结束时的 `recordUsage()` 阻塞客户端

**修复**：异步记录，不等待

```javascript
streamResponse.on('end', () => {
  res.end()  // 立即结束响应

  // 异步记录，不阻塞
  Promise.all([
    apiKeyService.recordUsage(...),
    applyRateLimitTracking(...)
  ]).catch((error) => {
    logger.error('Failed to record', error)
  })
})
```

### 4. usageReported Bug 修复

**上游Commit**: d7358107

```javascript
// 旧：const 无法修改
const usageReported = false

// 新：改为 let
let usageReported = false
```

### 5. TCP Keep-Alive 支持

**上游Commit**: 26ad7482

```javascript
const keepAliveAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,   // 每30秒发送 TCP keep-alive 探测
  timeout: 120000,
  maxSockets: 100,
  maxFreeSockets: 10
})
```

### 6. Timeout 配置优化

**上游Commits**: 94925e57, 26ad7482

```javascript
// 非流式请求：60秒 → 10分钟
// 流式请求：60秒 → 无限制（由 AbortSignal 控制）
```

### 7. 流错误处理改进

**上游Commit**: d7358107

```javascript
// 旧：字符串插值（可能格式错误）
res.write(`data: {"error": {"message": "${error.message}"}}\n\n`)

// 新：JSON.stringify
res.write(`data: ${JSON.stringify({
  error: {
    message: error.message || 'Stream error',
    type: 'stream_error',
    code: error.code
  }
})}\n\n`)
```

### 8. Docker 镜像优化

**上游Commit**: 696a095f

排除 `redis_data/` 目录，减小镜像体积

### 9. Workflow 手动触发支持

**上游Commit**: 6d8bf99e

添加 `workflow_dispatch` 手动触发支持

---

## [v1.1.193 - v1.1.194] - 2025-11-15

**合并到**: v2.0.12

### v1.1.193 关键 Bug 修复

#### SSE 流式响应缓冲区修复 (7a6c287a)

- **问题描述**: Gemini 流式响应在网络不稳定时因 TCP 数据包分割导致 SSE 解析失败
- **根本原因**: 缺少对不完整 SSE 数据行的缓冲区处理
- **修复内容**:
  - 新增 `src/utils/sseParser.js` - 统一的 SSE 解析工具（52行）
  - `src/routes/geminiRoutes.js` 导入 `parseSSELine` 函数
  - `src/routes/standardGeminiRoutes.js` 添加 `streamBuffer` 逻辑处理 TCP 分包

#### tokeninfo/userinfo 调用优化 (47d7a394)

- **问题描述**: Gemini 企业账户每次请求都被误调用 tokeninfo/userinfo 接口
- **修复内容**: 添加 `if (!projectId)` 判断，仅对个人账户调用

#### 代码质量改进

- 恢复 `forwardToCodeAssist` 函数 (91ad0658)
- 恢复 `handleSimpleEndpoint` 函数 (df796a00)
- 恢复 tools/toolConfig 支持 (e1304058)
- 移除 thought 字段过滤 (008c7a2b)

### v1.1.194 功能

#### 持久化安装路径功能 (5c021115)

- 新增 `persist_install_path` 函数（`scripts/manage.sh`）
- 将安装路径保存到 `~/.config/crs/install.conf`

---

## [v1.1.191] - 2025-11-05

**合并到**: v2.0.0 (基线版本)

### Bug Fixes

#### 修复 Codex (OpenAI-Responses) 账户 403 错误处理缺陷

**问题描述**:
- 当 Codex 账户的 refresh token 失效时，API 返回 403 Forbidden 错误
- 系统未标记账户为不可用状态（unauthorized）
- 调度器持续选择该失效账户，导致所有请求持续返回 403

**修复内容**:
- `src/services/openaiResponsesRelayService.js`: 添加 403 错误处理
- `src/services/unifiedOpenAIScheduler.js`: 共享池筛选添加 `unauthorized` 状态过滤

**修复效果**:
- 账户失效后立即被标记为 `status: 'unauthorized'` 和 `schedulable: false`
- 后续请求自动切换到其他正常账户

---

## 合并策略说明

### 冲突解决原则

1. **VERSION**: 保留当前分支版本策略（2.x 系列）
2. **openaiRoutes.js**: 保留三级优先级系统，拒绝上游硬编码 prompt
3. **Prompt 内容**: 接受上游 prompt 内容更新，同步到 `resources/prompts/`

### 拒绝的上游变更

- 硬编码 instructions（违反"拒绝硬编码"原则）
- 任何破坏三级优先级系统的变更
- 任何破坏 promptLoader 架构的变更

### 审计标准

每次合并前执行 Linus 式五层审计：
1. 数据结构分析
2. 特殊情况识别
3. 复杂度审查
4. 破坏性分析
5. 实用性验证
