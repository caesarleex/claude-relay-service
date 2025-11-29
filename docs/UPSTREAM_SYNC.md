# Upstream Sync History

本文档记录从上游仓库 (Wei-Shaw/claude-relay-service) 合并的变更历史。

**上游仓库**: https://github.com/Wei-Shaw/claude-relay-service.git

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
