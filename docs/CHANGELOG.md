# Changelog

本文档记录**我们的原创功能和改进**。

上游同步记录请查看 [UPSTREAM_SYNC.md](./UPSTREAM_SYNC.md)

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

---

## [2.0.50] - 2025-12-25

### Security

- **安全修复**: 鉴权检测重大漏洞修复 (from upstream v1.1.241)
  - 防止伪造会话绕过管理员认证
  - 验证会话必须包含 `username` 和 `loginTime` 字段
  - 启动时自动清理无效/伪造的管理员会话
  - 影响文件：`auth.js`、`app.js`、`web.js`

### Added

- **功能增强**: 账户导出同步 API (from upstream v1.1.240)
  - 新增 `/api/accounts` 端点，支持导出所有账户数据
  - 新增 `/api/proxies` 端点，支持导出所有代理配置
  - 支持 Sub2API 从 CRS 批量同步账户
  - 影响文件：`sync.js`（新增）、`admin/index.js`

---

## [2.0.49] - 2025-12-24

### Fixed

- **修复**: 代码审计发现的合并冲突残留问题
  - `claudeRelayService.js`: 移除重复的队列锁释放代码块（死代码）
  - `droidRelayService.js`: 修复 comm 端点 prompt 注入
    - 移除重复的代码块
    - 将 `this.systemPrompt`（未定义）改为 `droidPrompt`（promptLoader）
    - 添加日志保持与其他端点一致

---

## [2.0.48] - 2025-12-24

### Added

- **功能增强**: 403 错误重试机制 (from upstream v1.1.239)
  - claude-official 账户遇到 403 错误时自动重试（最多 2 次，间隔 2 秒）
  - 流式和非流式请求均支持
  - 影响文件：`claudeRelayService.js`

### Fixed

- **修复**: Redis WRONGTYPE 错误 (from upstream v1.1.239)
  - 并发清理前进行 zset 类型检查
  - 自动清理遗留的非 zset 类型键
  - 影响文件：`redis.js`、`app.js`

### Changed

- **优化**: 启动时清理并发排队计数器 (from upstream v1.1.239)
  - 新增 `CLEAR_CONCURRENCY_QUEUES_ON_STARTUP` 环境变量（默认 true）
  - 多实例部署时建议设为 false
  - 影响文件：`app.js`

---

## [2.0.41] - 2025-12-11

### Changed

- **优化**: 用户消息队列锁机制重构 (from upstream v1.1.231-232)
  - 移除续租机制（`startLockRenewal`、`stopAllRenewalTimers`）
  - 实现早期锁释放：请求发送后立即释放，无需等待响应完成
  - 流式请求在收到 HTTP 200 响应头后通过回调释放锁
  - 配置默认值优化：`lockTtlMs` 120s→5s, `timeoutMs` 60s→5s, `delayMs` 100→200ms
  - 新增 `USER_MESSAGE_QUEUE_LOCK_TTL_MS` 环境变量支持
  - 影响文件：`userMessageQueueService.js`、`claudeRelayService.js`、`claudeConsoleRelayService.js`、`app.js`、`config.example.js`

- **日志改进**: 客户端断开连接日志级别优化 (from upstream v1.1.232)
  - "Client disconnected" 从 ERROR 降为 INFO 级别
  - 影响文件：`claudeConsoleRelayService.js`、`droidRelayService.js`、`ccrRelayService.js`、`openaiResponsesRelayService.js`

### Security

- **安全修复**: 避免真实令牌泄露到 DEBUG_HTTP_TRAFFIC 日志 (from upstream v1.1.231)

---

## [2.0.40] - 2025-12-10

### Added

- **功能增强**: 用户消息串行队列服务 (from upstream v1.1.229-230)
  - 新增 `userMessageQueueService.js` 防止同账户并发用户消息触发限流
  - 支持 Redis 分布式锁实现串行化
  - 新增 Web 界面配置开关和参数调整
  - 新增环境变量：`USER_MESSAGE_QUEUE_ENABLED`、`USER_MESSAGE_QUEUE_DELAY_MS`、`USER_MESSAGE_QUEUE_TIMEOUT_MS`
  - 影响文件：`userMessageQueueService.js`、`claudeRelayService.js`、`claudeConsoleRelayService.js`、`bedrockRelayService.js`、`ccrRelayService.js`、`SettingsView.vue`

### Changed

- **文档更新**: CLAUDE.md 添加用户消息队列配置说明

---

## [2.0.39] - 2025-12-08

### Fixed

- **修复**: 强制会话绑定首次会话 bug (from upstream v1.1.228)
  - 新增 `isOldSession()` 函数改进旧会话检测
  - 修复账户数据格式问题（`account.data` → `account`）
  - 影响文件：`api.js`、`claudeRelayConfigService.js`

### Changed

- **UI**: 文案优化 - "全局会话绑定"改为"强制会话绑定"
  - 影响文件：`SettingsView.vue`

---

## [2.0.38] - 2025-12-08

### Added

- **功能增强**: Claude 会话强制绑定 (from upstream v1.1.227)
  - 新增全局会话绑定开关，支持强制 Claude Code 请求
  - 新增会话绑定 TTL 配置（1-365天）
  - 新增会话绑定错误消息自定义
  - 新增会话绑定统计查询 API
  - 新增 `/admin/claude-relay-config` 配置端点
  - 新增 SettingsView Claude 转发配置 Tab
  - 影响文件：`claudeRelayConfigService.js`、`claudeRelayConfig.js`、`api.js`、`unifiedClaudeScheduler.js`、`SettingsView.vue`

- **功能增强**: Explore agent 系统提示词模板优化 (from upstream v1.1.227)
  - 改进日志级别和模板处理
  - 影响文件：`contents.js`、`claudeCodeValidator.js`

### Fixed

- **修复**: API Keys 页面窗口费率显示问题 (from upstream v1.1.227)
  - 影响文件：`apiKeys.js`

- **修复**: Claude 参数传递格式统一 (from upstream v1.1.227)
  - 抽离 `_prepareRequestHeadersAndPayload` 公共方法
  - 影响文件：`claudeRelayService.js`

---

## [2.0.37] - 2025-12-08

### Added

- **功能增强**: 并发管理 API (from upstream v1.1.225)
  - 新增 `/admin/concurrency` 端点查看所有并发状态
  - 新增手动清理并发计数功能
  - 新增并发租约最大生存时间保护（默认10分钟）
  - 影响文件：`concurrency.js`、`auth.js`、`redis.js`

- **功能增强**: Droid 增强 (from upstream v1.1.225-226)
  - 支持账户级别自定义 User-Agent
  - 动态 x-api-provider（-max 模型用 openai）
  - OpenAI 格式 cache token 捕获
  - User-Agent 版本更新至 0.32.1
  - 影响文件：`droidRelayService.js`、`droidAccountService.js`、`AccountForm.vue`

- **功能增强**: Docker 构建优化 (from upstream v1.1.225)
  - 后端依赖与前端构建并行
  - BuildKit 缓存加速

### Fixed

- **修复**: API Keys 窗口费率显示问题 (from upstream v1.1.226)
  - 修复 rateLimitWindow 字符串比较问题
  - 影响文件：`apiKeys.js`

---

## [2.0.36] - 2025-12-07

### Added

- **功能增强**: API Keys 模型筛选功能 (from upstream v1.1.224)
  - 新增模型筛选下拉框，支持按使用过的模型筛选 API Keys
  - CustomDropdown 组件支持多选模式 (`multiple` 属性)
  - 新增 `GET /admin/api-keys/used-models` 端点获取所有已使用模型
  - 新增 `getKeyIdsWithModels()` 和 `getAllUsedModels()` Redis 函数
  - 影响文件：`redis.js`、`apiKeys.js`、`CustomDropdown.vue`、`ApiKeysView.vue`

---

## [2.0.35] - 2025-12-06

### Added

- **功能增强**: Pro 账户支持 Opus 4.5+ 模型 (from upstream v1.1.223)
  - Pro 账号：支持 Opus 4.5+ 模型，不支持历史版本 (3.x/4.0/4.1)
  - Free 账号：不支持任何 Opus 模型
  - Max 账号：支持所有 Opus 版本
  - 新增 `isOpus45OrNewer()` 模型版本检测函数
  - 新增 `isProAccount()` 账户类型检测函数
  - 影响文件：`modelHelper.js`、`claudeAccountService.js`、`unifiedClaudeScheduler.js`

- **功能增强**: 上游不稳定错误检测与账户临时不可用机制 (from upstream v1.1.223)
  - 5xx 错误自动标记账户临时不可用（5分钟 TTL）
  - 专属账户临时不可用时自动回退到池
  - 池账户选择时跳过临时不可用的账户
  - 新增 `unstableUpstreamHelper.js` 工具
  - 支持环境变量扩展检测规则
  - 影响文件：`claudeRelayService.js`、`unifiedClaudeScheduler.js`

- **功能增强**: 账户使用记录时间线 (from upstream v1.1.223)
  - 新增 `/admin/accounts/:accountId/usage-records` 端点
  - 新增 `AccountUsageRecordsView.vue` 页面
  - 支持按账户聚合多 Key 记录并分页筛选
  - 影响文件：`usageStats.js`、`router/index.js`、`AccountsView.vue`

### Fixed

- **模型限制重构**: 模型限制改为黑名单模式 (from upstream v1.1.223)
  - 原：白名单模式（仅允许列表中的模型）
  - 新：黑名单模式（禁止列表中的模型）
  - 影响文件：`openaiClaudeRoutes.js`、`openaiRoutes.js`

- **UI 优化**: ActionDropdown 和 CustomDropdown 改进 (from upstream v1.1.223)
  - 优化下拉菜单位置计算
  - 支持层级结构显示
  - 全局互斥，避免多菜单堆叠

---

## [2.0.34] - 2025-12-05

### Added

- **功能增强**: API Key 使用记录时间线功能 (from upstream v1.1.221-222)
  - 新增 API Key 使用记录查看页面 (`ApiKeyUsageRecordsView.vue`)
  - 新增使用记录详情弹窗 (`RecordDetailModal.vue`)
  - 支持按时间范围筛选使用记录
  - 新增路由 `/api-keys/:id/usage-records`
  - 新增 API 端点：`GET /admin/api-keys/:id/usage-records`
  - 影响文件：前端组件、路由、后端 usageStats.js

### Fixed

- **Bug 修复**: 修复 Gemini handlers ProxyAgent 调用方式错误 (from upstream v1.1.221)
  - 问题：错误使用实例方法调用 `new ProxyHelper().createProxyAgent()`
  - 修复：改为静态方法调用 `ProxyHelper.createProxyAgent()`
  - 影响文件：`src/handlers/geminiHandlers.js`

- **Bug 修复**: 修复 Dashboard 趋势图表显示问题 (from upstream v1.1.222)
  - 修复日期过滤器显示
  - 修复趋势图表数据渲染
  - 影响文件：`DashboardView.vue`、`dashboard.js`

- **UI 修复**: Modal 弹窗定位优化 (from upstream v1.1.221)
  - 修复 `UsageDetailModal.vue` 弹窗位置问题
  - ESLint no-shadow 规则修复

---

## [2.0.33] - 2025-12-04

### Added

- **功能增强**: Claude Console 账户支持禁用自动防护开关 (from upstream v1.1.220)
  - 新增 `disableAutoProtection` 配置项
  - 启用后 401/400/429/529 错误不再自动禁用账户
  - 错误仍记录日志并透传，用户可自行决定处理方式
  - 影响文件：`claudeConsoleAccountService.js`、`claudeConsoleRelayService.js`、`claudeConsoleAccounts.js`、`AccountForm.vue`

### Fixed

- **Bug 修复**: 修复 Claude OAuth 账户连通性测试 404 错误
  - 问题：`testAccountConnection` 方法错误拼接 URL 导致路径重复
  - 修复：直接使用 `this.claudeApiUrl`，与正常转发方法保持一致
  - 引入版本：v2.0.29，本版本修复

---

## [2.0.32] - 2025-12-04

### Added

- **功能增强**: 账户列表排序支持正序/倒序切换
  - 统一下拉框和表格标题排序变量
  - 动态更新排序图标
  - 影响文件：`web/admin-spa/src/views/AccountsView.vue`

### Fixed

- **安全修复**: 过滤 Cloudflare CDN headers 以防止 API 安全检查
  - 新增统一的 `headerFilter.js` 工具类
  - 过滤 13 个 Cloudflare CDN headers（cf-*, x-forwarded-* 等）
  - 解决使用 Cloudflare 橙色云时上游 API 返回 403 的问题
  - 影响文件：`src/utils/headerFilter.js`、`src/services/claudeRelayService.js`、`src/services/openaiResponsesRelayService.js`

---

## [2.0.31] - 2025-12-02

### Added

- **功能增强**: 支持 sessionKey (Cookie) 自动完成 OAuth 授权
  - 新增 Cookie 自动授权流程，无需手动打开浏览器
  - 支持批量创建账户（多 sessionKey 同时处理）
  - 自动获取组织 UUID 和能力列表
  - 新增 API 端点：`/admin/claude-accounts/oauth-with-cookie`
  - 新增 API 端点：`/admin/claude-accounts/setup-token-with-cookie`
  - 前端增加授权方式选择（手动/Cookie 自动）
  - 前端增加 sessionKey 获取帮助说明
  - 影响文件：`src/utils/oauthHelper.js`、`src/routes/admin/claudeAccounts.js`、前端组件

---

## [2.0.30] - 2025-12-02

### Fixed

- **严重 Bug 修复**: 修复 Claude API 400 错误 (tool_use/tool_result 不匹配)
  - 问题：`_enforceCacheControlLimit` 方法删除整个内容块导致 tool_use 丢失
  - 影响：删除 tool_use 导致后续 tool_result 找不到对应的 tool_use_id，产生 400 错误
  - 修复：只删除 `cache_control` 属性，保留内容本身
  - 影响文件：`src/services/claudeRelayService.js`
- **Bug 修复**: 调整 Gemini-API BaseApi 后缀以适配更多端点
  - 新增 `buildGeminiApiUrl()` 工具函数
  - 兼容新旧 baseUrl 格式（以 /models 结尾 vs 不以 /models 结尾）
  - 影响文件：`src/handlers/geminiHandlers.js`

### Added

- **功能增强**: Console 账号 count_tokens 端点智能判断
  - 自动检测 Console 账户的 count_tokens 可用性
  - 不可用时返回 fallback 响应 `{ input_tokens: 0 }`
  - 新增状态管理方法：`markCountTokensUnavailable()`、`isCountTokensUnavailable()`
  - 影响文件：`src/routes/api.js`、`src/services/claudeConsoleAccountService.js`

### Changed

- **前端优化**: 表格布局优化
  - 优化 `AccountsView.vue` 和 `ApiKeysView.vue` 表格显示
  - 改进响应式布局和列宽处理

### Rejected

- **拒绝合并**: 上游 e8e6f972 (增强 console 账号 test 端点)
  - 拒绝理由：上游改动删除 `promptLoader` 和 P0/P1/P2/P3 优先级系统，与我们架构冲突
  - 影响：会删除我们在 v2.0.29 实现的配置化架构，引入硬编码
  - 决策：保持 v2.0.29 实现（使用 promptLoader，零硬编码，架构更优）

---

## [2.0.29] - 2025-11-29

### Changed
- **架构优化**: 重写账户测试方法，实现测试与生产隔离
  - `claudeRelayService.js`: 重写 `testAccountConnection` 方法
  - `claudeConsoleRelayService.js`: 采用上游重写方案
  - 测试不再触发账户状态变更（`markAccountUnauthorized` 等）
  - 使用 `promptLoader` 获取系统提示词（零硬编码）

### Added
- **新功能**: 从上游 v1.1.214 合并
  - Gemini-API 共享池调度修复（`isActive` 类型兼容）
  - Gemini-API 分组调度设置修复（多分组支持）
  - OpenAI-API 分组调度设置修复（支持 `openai-responses` 账户）
  - 表格显示优化（固定列宽 + `ActionDropdown` 组件）

### Fixed
- **Bug 修复**: 从上游 v1.1.214 合并
  - 修复 Gemini-API 账户共享池无法调度问题
  - 修复 Gemini-API 账户分组调度设置不生效的问题
  - 修复 OpenAI-API 账户分组调度设置问题
  - 修复 Claude Console 账号 Test 未响应的 bug

---

## [2.0.28] - 2025-11-28

### Changed
- **架构重构**: 模块化重构 `admin.js`（基于上游 v1.1.213）
  - 将 10246 行单文件拆分为 18 个职责清晰的模块
  - 新增 `src/routes/admin/prompts.js` 保留 v2.0.0 原创 Prompt 管理功能
  - 零功能丢失，向后兼容

### Added
- **新功能**: 从上游 v1.1.213 合并
  - `requestIdentityService`: Claude 请求身份转换（替换 runtimeAddon）
  - `costRankService`: API Key 费用排序功能
  - 账户测试功能: Claude/Console 账户在线测试
  - API Key 测试功能: 支持 Claude 端点测试

### Fixed
- **Bug 修复**: 从上游 v1.1.213 合并
  - 修复 Gemini API 账户转发的传参问题
  - 修复 Gemini API 类型账户绑定显示问题
  - 修复 API Key 窗口限制时间显示异常
  - Droid 增加 comm 端点支持
- **Bug 修复**: 修复上游账户测试功能的响应流未关闭问题
  - 问题：当账户不存在或 Token 获取失败时，SSE 响应流未调用 `end()`，导致前端一直等待
  - 影响文件：`claudeRelayService.js`、`claudeConsoleRelayService.js`

---

## [2.0.27] - 2025-11-28

### Changed
- **代码优化**: 消除 `promptLoader.js` 中 `getHealthStatus()` 方法的硬编码
  - 改为从 `fileMap` 动态生成服务列表
  - 提升可扩展性：添加新服务只需修改一处
- **配置优化**: 修复模型价格数据源配置
  - 修改 `config/pricingSource.js` 默认仓库为 `Wei-Shaw/claude-relay-service`
  - 原默认值 `caesarleex/claude-relay-service` 没有 price-mirror 分支，导致下载失败
  - 新增 `.env.example` 中的 `PRICE_MIRROR_REPO` 配置说明
  - 零维护成本，自动获取上游最新模型价格数据

### Removed
- **文档清理**: 移除赞助相关图片和过时文档
  - 删除 `docs/sponsoring/alipay.jpg`
  - 删除 `docs/sponsoring/wechat.jpg`
  - 删除 `docs/MERGE_UPSTREAM_V1.1.211.md`
  - 删除 `docs/github-workflow-troubleshooting.md`
- **Workflow 清理**: 删除 `.github/workflows/sync-model-pricing.yml`
  - 直接使用上游 price-mirror 分支，无需自建

---

## [2.0.24] - 2025-11-24

### Changed
- 🔄 **更新 Codex prompt 内容**到最新版本（GPT-5 基础）
  - 从 23KB 优化到约 12KB（减少约 50%）
  - 保留 promptLoader 实现（零硬编码）
  - 用户仍可通过 Web 界面自定义 prompt

### Removed
- 🗑️ **移除过度工程**: Context Management Beta"智能检查"（PR #666）
  - 原因：Claude Code 不使用该功能（发送的是 context-1m/web-search beta headers）
  - 上游的简单删除是正确的

### Technical
- ❌ **拒绝上游 openaiRoutes.js 的硬编码 instructions**（commit 53d2f1ff）
  - 设计（WHAT）：保留 Prompt 管理系统架构
  - 内容（HOW）：同步上游新版 prompt 内容到 resources/prompts/codex.txt
  - 原因：硬编码违反我们的"零硬编码"原则

---

## [2.0.23] - 2025-11-23

### Technical - 资源管理设计决策

**真正实施**: 移除 heartbeatTimer 在 `req.on('close')` 中的清理逻辑

**设计决策**: 完全信任上游设计，采用上游的资源管理策略

**现在的清理机制**（完全信任上游设计）:
```javascript
// claudeConsoleRelayService.js:600-607
const cleanup = () => {
  cleanupExecuted = true
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer)  // ✅ 在 end/error 中清理
    heartbeatTimer = null
  }
  if (proxyRes && !proxyRes.destroyed) {
    proxyRes.destroy()
  }
}

response.data.on('end', cleanup)
response.data.on('error', cleanup)

// ❌ 不再在 req.on('close') 中清理 heartbeatTimer
```

**理由**:
1. 上游验证：上游代码在生产环境运行，无泄漏证据
2. Node.js 流保证：`end`/`error` 事件覆盖所有退出场景
3. 避免分歧：保持与上游设计一致，便于后续同步

---

## [2.0.19] - 2025-11-16

### Fixed
- 🔧 **修复 Workflow 版本决策逻辑**: Release vs Tag 比对
  - 问题：VERSION 文件修改的 commit 创建了 tag，但在 build 阶段失败时，下次运行仍会自动递增版本
  - 修复：使用最新 Release 版本（而非 tag）作为比对基准
  - 场景：VERSION-modifying commit 创建了 tag 但在 build 阶段失败

---

## [2.0.17] - 2025-11-16

### Fixed
- 🔧 **移除不支持的 input_examples 字段**（Claude Code v2.0.42 兼容性）
  - 问题：Claude Code v2.0.42 发送包含 `input_examples` 的请求，导致 Claude API 400 错误
  - 修复：在 `_processRequestBody()` 中移除该字段

---

## [2.0.15] - 2025-11-15

### Fixed
- 🔧 **智能 Context Management Beta 验证**（拒绝上游粗暴删除方案）
  - 问题：Claude Code 发送 `context_management` 参数，但该 beta 仅在特定地区可用
  - 上游方案：直接删除该参数（可能导致未来兼容性问题）
  - 我们的方案：智能验证 - 仅当 `betas` 中包含 `context_management` 时保留
  - 设计原则：向前兼容，避免破坏未来功能

---

## [2.0.14] - 2025-11-15

### Fixed
- 🔧 **Express 5 启动崩溃修复**（path-to-regexp v8 兼容性）
  - 问题：Express 5.1.0 + path-to-regexp 8.0.0 导致通配符路由报错
  - 修复：通配符必须命名（`/*` → `/*path`）

---

## [2.0.10] - 2025-11-07

### Fixed
- 🔧 **Claude Code Native API 认证失败修复**
  - 问题：使用 Claude OAuth 凭据时，Native API 返回 401 错误
  - 原因：请求体缺少 Claude Code system prompt
  - 修复：实现 P0-P3 优先级系统，确保非真实 Claude Code 请求包含 system prompt

### Changed
- 🎯 **支持手动版本控制**: Workflow 自动检测 VERSION 文件变更
  - 如果 VERSION 文件在当前 commit 中被修改 → 使用手动版本
  - 如果 VERSION > 最新 tag → 使用手动版本
  - 否则 → 自动递增版本

---

## [2.0.7] - 2025-11-06

### Fixed
- 🔧 **Prompts 管理路由改进**: 移除冗余包装函数
- 🎨 **PromptsView 组件优化**: 改进交互体验

---

## [2.0.6] - 2025-01-05

### Fixed
- 🔧 **Prompts 管理 Web 界面显示问题**

---

## [2.0.5] - 2025-01-05

### Fixed
- 🔧 **配置和代码质量修复**

---

## [2.0.4] - 2025-01-05

### Fixed
- 🔧 **Prompts 管理系统修复**（Docker 部署环境）
  - 修复文件路径问题
  - 确保生产环境正常运行

---

## [2.0.0] - 2025-01-05

### Added - 统一 Prompt 管理系统（核心原创功能）

**架构设计**：
- 🎯 **零硬编码**: 所有 prompts 存储在 `resources/prompts/` 目录
- 📦 **promptLoader.js**: O(1) 内存缓存，支持热重载
- 🌐 **Web 管理界面**: `/admin-next/prompts` 可视化编辑
- 🔄 **三级优先级系统**:
  - P1（用户优先）: 保留用户自定义 system message
  - P2（默认）: 使用配置的默认 prompt
  - P3（禁用）: 配置禁用时不注入

**文件结构**:
```
resources/prompts/
├── README.md           # Prompt 管理文档
├── codex.txt          # Codex (OpenAI Responses) prompt
├── claude-code.txt    # Claude Code prompt
└── droid.txt          # Droid (Factory.ai) prompt
```

**配置系统**:
```javascript
// config/config.example.js
prompts: {
  codex: { enabled: process.env.CODEX_PROMPT_ENABLED !== 'false' },
  claudeCode: { enabled: process.env.CLAUDE_CODE_PROMPT_ENABLED !== 'false' },
  droid: { enabled: process.env.DROID_PROMPT_ENABLED !== 'false' }
}
```

**集成点**:
- `claudeRelayService.js`: P0-P3 优先级 Claude Code prompt 注入
- `openaiRoutes.js`: 三级优先级 Codex prompt 处理
- `droidRelayService.js`: P2/P3 优先级 Droid prompt 前置注入
- `openaiToClaude.js`: OpenAI→Claude 转换时的 prompt 处理

**管理 API**:
- `GET /admin/prompts/meta/config` - 获取配置元数据
- `GET /admin/prompts/:service` - 获取 prompt 内容
- `PUT /admin/prompts/:service` - 手动编辑保存
- `POST /admin/prompts/:service/upload` - 文件上传
- `POST /admin/prompts/:service/download-url` - URL 下载

**拒绝上游硬编码**:
```javascript
// ❌ 上游方案（硬编码 200+ 行）
req.body.instructions = "You are Codex, based on GPT-5..."

// ✅ 我们的方案（可配置）
const defaultPrompt = promptLoader.getPrompt('codex')
if (defaultPrompt) {
  req.body.instructions = defaultPrompt
}
```
