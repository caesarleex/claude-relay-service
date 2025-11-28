# Changelog

本文档记录**我们的原创功能和改进**。

上游同步记录请查看 [UPSTREAM_SYNC.md](./UPSTREAM_SYNC.md)

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

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
