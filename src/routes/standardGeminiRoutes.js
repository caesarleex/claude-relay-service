/**
 * 标准 Gemini API 路由模块
 *
 * 该模块处理标准 Gemini API 格式的请求：
 * - v1beta/models/:modelName:generateContent
 * - v1beta/models/:modelName:streamGenerateContent
 * - v1beta/models/:modelName:countTokens
 * - v1beta/models/:modelName:loadCodeAssist
 * - v1beta/models/:modelName:onboardUser
 * - v1/models/:modelName:* (同上)
 * - v1internal:* (内部格式)
 * - v1beta/models, v1/models (模型列表)
 * - v1beta/models/:modelName, v1/models/:modelName (模型详情)
 *
 * 所有处理函数都从 geminiHandlers.js 导入，以避免代码重复。
 */

const express = require('express')
const router = express.Router()
const { authenticateApiKey } = require('../middleware/auth')
const logger = require('../utils/logger')

// 从 handlers/geminiHandlers.js 导入所有处理函数
const {
  ensureGeminiPermissionMiddleware,
  handleLoadCodeAssist,
  handleOnboardUser,
  handleCountTokens,
  handleGenerateContent,
  handleStreamGenerateContent,
  handleStandardGenerateContent,
  handleStandardStreamGenerateContent,
  handleModels,
  handleModelDetails
} = require('../handlers/geminiHandlers')

// ============================================================================
// v1beta 版本的标准路由 - 支持动态模型名称
// ============================================================================

/**
 * POST /v1beta/models/:modelName:loadCodeAssist
 */
router.post(
  '/v1beta/models/:modelName\\:loadCodeAssist',
  authenticateApiKey,
  ensureGeminiPermissionMiddleware,
  handleLoadCodeAssist
)

/**
 * POST /v1beta/models/:modelName:onboardUser
 */
router.post(
  '/v1beta/models/:modelName\\:onboardUser',
  authenticateApiKey,
  ensureGeminiPermissionMiddleware,
  handleOnboardUser
)

/**
 * POST /v1beta/models/:modelName:countTokens
 */
router.post(
  '/v1beta/models/:modelName\\:countTokens',
  authenticateApiKey,
  ensureGeminiPermissionMiddleware,
  handleCountTokens
)

/**
 * POST /v1beta/models/:modelName:generateContent
 */
router.post(
  '/v1beta/models/:modelName\\:generateContent',
  authenticateApiKey,
  ensureGeminiPermissionMiddleware,
  handleStandardGenerateContent
)

/**
 * POST /v1beta/models/:modelName:streamGenerateContent
 */
router.post(
  '/v1beta/models/:modelName\\:streamGenerateContent',
  authenticateApiKey,
  ensureGeminiPermissionMiddleware,
  handleStandardStreamGenerateContent
)

// ============================================================================
// v1 版本的标准路由 - 支持动态模型名称
// ============================================================================

/**
 * POST /v1/models/:modelName:loadCodeAssist
 */
router.post(
  '/v1/models/:modelName\\:loadCodeAssist',
  authenticateApiKey,
  ensureGeminiPermissionMiddleware,
  handleLoadCodeAssist
)

/**
 * POST /v1/models/:modelName:onboardUser
 */
router.post(
  '/v1/models/:modelName\\:onboardUser',
  authenticateApiKey,
  ensureGeminiPermissionMiddleware,
  handleOnboardUser
)

/**
 * POST /v1/models/:modelName:countTokens
 */
router.post(
  '/v1/models/:modelName\\:countTokens',
  authenticateApiKey,
  ensureGeminiPermissionMiddleware,
  handleCountTokens
)

/**
 * POST /v1/models/:modelName:generateContent
 */
router.post(
  '/v1/models/:modelName\\:generateContent',
  authenticateApiKey,
  ensureGeminiPermissionMiddleware,
  handleStandardGenerateContent
)

/**
 * POST /v1/models/:modelName:streamGenerateContent
 */
router.post(
  '/v1/models/:modelName\\:streamGenerateContent',
  authenticateApiKey,
  ensureGeminiPermissionMiddleware,
  handleStandardStreamGenerateContent
)

// ============================================================================
// v1internal 版本路由（固定模型）
// ============================================================================

/**
 * POST /v1internal:loadCodeAssist
 */
router.post('/v1internal\\:loadCodeAssist', authenticateApiKey, handleLoadCodeAssist)

/**
 * POST /v1internal:onboardUser
 */
router.post('/v1internal\\:onboardUser', authenticateApiKey, handleOnboardUser)

/**
 * POST /v1internal:countTokens
 */
router.post('/v1internal\\:countTokens', authenticateApiKey, handleCountTokens)

/**
 * POST /v1internal:generateContent
 */
router.post('/v1internal\\:generateContent', authenticateApiKey, handleGenerateContent)

/**
 * POST /v1internal:streamGenerateContent
 */
router.post('/v1internal\\:streamGenerateContent', authenticateApiKey, handleStreamGenerateContent)

// ============================================================================
// 模型列表和模型详情路由
// ============================================================================

/**
 * GET /v1beta/models
 * 获取所有可用模型列表
 */
router.get('/v1beta/models', authenticateApiKey, handleModels)

/**
 * GET /v1/models
 * 获取所有可用模型列表 (v1 版本)
 */
router.get('/v1/models', authenticateApiKey, handleModels)

/**
 * GET /v1beta/models/:modelName
 * 获取特定模型的详细信息
 */
router.get(
  '/v1beta/models/:modelName',
  authenticateApiKey,
  ensureGeminiPermissionMiddleware,
  handleModelDetails
)

/**
 * GET /v1/models/:modelName
 * 获取特定模型的详细信息 (v1 版本)
 */
router.get(
  '/v1/models/:modelName',
  authenticateApiKey,
  ensureGeminiPermissionMiddleware,
  handleModelDetails
)

// ============================================================================
// 初始化日志
// ============================================================================

logger.info('Standard Gemini API routes initialized')

module.exports = router