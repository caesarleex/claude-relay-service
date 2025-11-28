/**
 * Admin Routes - Prompts 管理模块
 * v2.0.0 原创功能：统一 Prompt 管理系统
 *
 * 功能：
 * - GET /admin/prompts/meta/config - 获取配置元数据
 * - GET /admin/prompts/:service - 获取 prompt 内容
 * - PUT /admin/prompts/:service - 手动编辑保存
 * - POST /admin/prompts/:service/upload - 文件上传
 * - POST /admin/prompts/:service/import-url - URL 导入
 */

const express = require('express')
const router = express.Router()
const fs = require('fs')
const https = require('https')
const multer = require('multer')

const { authenticateAdmin } = require('../../middleware/auth')
const logger = require('../../utils/logger')
const promptLoader = require('../../services/promptLoader')
const config = require('../../../config/config')

const upload = multer({ storage: multer.memoryStorage() })

// ============================================================================
// Prompt 管理配置常量
// ============================================================================

/**
 * Prompt 文件大小限制（1MB）
 */
const MAX_PROMPT_SIZE = 1 * 1024 * 1024

/**
 * 无效 Unicode 字符正则（控制字符、零宽字符等）
 */
/* eslint-disable no-control-regex */
const INVALID_CHARS_REGEX =
  /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u200B-\u200D\u2060-\u206F\u202A-\u202E]/g
/* eslint-enable no-control-regex */

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 辅助函数：从 URL 下载内容
 * @param {string} url - HTTPS URL
 * @param {number} timeout - 超时时间（毫秒），默认30秒
 * @returns {Promise<string>} 下载的内容
 */
function downloadFromUrl(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Download timeout after 30 seconds'))
    }, timeout)

    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          clearTimeout(timer)
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`))
          return
        }

        let data = ''
        res.setEncoding('utf8')
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          clearTimeout(timer)
          resolve(data)
        })
      })
      .on('error', (err) => {
        clearTimeout(timer)
        reject(err)
      })
  })
}

// ============================================================================
// Prompts 管理 API
// ============================================================================

/**
 * GET /admin/prompts/meta/config - 获取 Prompts 配置元数据
 */
router.get('/prompts/meta/config', authenticateAdmin, (req, res) => {
  try {
    const validServices = promptLoader.getValidServices()

    // 从 config 读取配置，零硬编码
    const serviceConfigs = validServices.map((serviceId) => ({
      id: serviceId,
      envVar: config.prompts[serviceId]?.envVar,
      envDescription: config.prompts[serviceId]?.description,
      enabled: config.prompts[serviceId]?.enabled ?? true
    }))

    res.json({
      success: true,
      data: serviceConfigs
    })
  } catch (error) {
    logger.error('Failed to get prompts config metadata:', error)
    res.status(500).json({ error: 'Failed to get config metadata', message: error.message })
  }
})

/**
 * GET /admin/prompts/:service - 获取 prompt 内容
 */
router.get('/prompts/:service', authenticateAdmin, (req, res) => {
  try {
    const { service } = req.params
    const validServices = promptLoader.getValidServices()

    if (!validServices.includes(service)) {
      return res.status(400).json({ error: 'Invalid service' })
    }

    const content = promptLoader.getPrompt(service)
    if (!content) {
      return res.status(404).json({ error: 'Prompt not found or not loaded' })
    }

    // 获取文件修改时间
    const filePath = promptLoader.getFilePath(service)
    const stats = fs.statSync(filePath)

    res.json({
      success: true,
      service,
      content,
      length: content.length,
      enabled: config.prompts[service]?.enabled ?? true,
      lastModified: stats.mtime.toISOString()
    })
  } catch (error) {
    logger.error('Failed to get prompt:', error)
    res.status(500).json({ error: 'Failed to get prompt', message: error.message })
  }
})

/**
 * PUT /admin/prompts/:service - 手动编辑保存 prompt
 */
router.put('/prompts/:service', authenticateAdmin, async (req, res) => {
  try {
    const { service } = req.params
    const { content } = req.body
    const validServices = promptLoader.getValidServices()

    if (!validServices.includes(service)) {
      return res.status(400).json({ error: 'Invalid service' })
    }

    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'Content must be a string' })
    }

    if (content.trim() === '') {
      return res.status(400).json({ error: 'Prompt content cannot be empty' })
    }

    if (content.length > MAX_PROMPT_SIZE) {
      return res.status(400).json({
        error: `Prompt too large. Maximum size is ${MAX_PROMPT_SIZE} bytes (${(MAX_PROMPT_SIZE / 1024 / 1024).toFixed(1)}MB)`
      })
    }

    if (INVALID_CHARS_REGEX.test(content)) {
      return res.status(400).json({
        error:
          'Prompt contains invalid Unicode characters (control characters, zero-width characters, etc.)'
      })
    }

    const filePath = promptLoader.getFilePath(service)
    if (!filePath) {
      return res.status(400).json({ error: 'Invalid service' })
    }

    fs.writeFileSync(filePath, content, 'utf8')

    await promptLoader.reload()

    logger.info(`✅ Updated ${service} prompt via manual edit (${content.length} chars)`)

    res.json({
      success: true,
      service,
      length: content.length,
      source: 'manual_edit',
      message: 'Prompt updated successfully'
    })
  } catch (error) {
    logger.error('Failed to update prompt:', error)
    res.status(500).json({ error: 'Failed to update prompt' })
  }
})

/**
 * POST /admin/prompts/:service/upload - 文件上传
 */
router.post('/prompts/:service/upload', authenticateAdmin, upload.single('file'), async (req, res) => {
  try {
    const { service } = req.params
    const validServices = promptLoader.getValidServices()

    if (!validServices.includes(service)) {
      return res.status(400).json({ error: 'Invalid service' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const content = req.file.buffer.toString('utf8')

    if (content.trim() === '') {
      return res.status(400).json({ error: 'Prompt content cannot be empty' })
    }

    if (content.length > MAX_PROMPT_SIZE) {
      return res.status(400).json({
        error: `Prompt too large. Maximum size is ${MAX_PROMPT_SIZE} bytes (${(MAX_PROMPT_SIZE / 1024 / 1024).toFixed(1)}MB)`
      })
    }

    if (INVALID_CHARS_REGEX.test(content)) {
      return res.status(400).json({
        error:
          'Prompt contains invalid Unicode characters (control characters, zero-width characters, etc.)'
      })
    }

    const filePath = promptLoader.getFilePath(service)
    if (!filePath) {
      return res.status(400).json({ error: 'Invalid service' })
    }

    fs.writeFileSync(filePath, content, 'utf8')

    await promptLoader.reload()

    logger.info(
      `✅ Uploaded ${service} prompt from file: ${req.file.originalname} (${content.length} chars)`
    )

    res.json({
      success: true,
      service,
      length: content.length,
      source: 'upload',
      originalName: req.file.originalname,
      message: 'Prompt uploaded successfully'
    })
  } catch (error) {
    logger.error('Failed to upload prompt:', error)
    res.status(500).json({ error: 'Failed to upload prompt' })
  }
})

/**
 * POST /admin/prompts/:service/import-url - 从 URL 导入
 */
router.post('/prompts/:service/import-url', authenticateAdmin, async (req, res) => {
  try {
    const { service } = req.params
    const { url, validate = true } = req.body
    const validServices = promptLoader.getValidServices()

    if (!validServices.includes(service)) {
      return res.status(400).json({ error: 'Invalid service' })
    }

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' })
    }

    let parsedUrl
    try {
      parsedUrl = new URL(url)
      if (parsedUrl.protocol !== 'https:') {
        return res.status(400).json({ error: 'Only HTTPS URLs are allowed for security' })
      }
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' })
    }

    const content = await downloadFromUrl(url)

    if (content.trim() === '') {
      return res.status(400).json({ error: 'Downloaded prompt is empty' })
    }

    if (content.length > MAX_PROMPT_SIZE) {
      return res.status(400).json({
        error: `Downloaded prompt too large. Maximum size is ${MAX_PROMPT_SIZE} bytes (${(MAX_PROMPT_SIZE / 1024 / 1024).toFixed(1)}MB)`
      })
    }

    if (INVALID_CHARS_REGEX.test(content)) {
      return res.status(400).json({
        error:
          'Downloaded prompt contains invalid Unicode characters (control characters, zero-width characters, etc.)'
      })
    }

    if (validate) {
      return res.json({
        validated: true,
        preview: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
        length: content.length,
        url,
        message: 'Validation successful. Send again with validate=false to save.'
      })
    }

    const filePath = promptLoader.getFilePath(service)
    if (!filePath) {
      return res.status(400).json({ error: 'Invalid service' })
    }

    fs.writeFileSync(filePath, content, 'utf8')

    await promptLoader.reload()

    logger.info(`✅ Imported ${service} prompt from URL: ${url} (${content.length} chars)`)

    res.json({
      success: true,
      service,
      length: content.length,
      source: 'url',
      url,
      message: 'Prompt imported successfully'
    })
  } catch (error) {
    logger.error('Failed to import prompt from URL:', error)
    res.status(500).json({ error: `Failed to import prompt from URL: ${error.message}` })
  }
})

module.exports = router
