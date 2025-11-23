/**
 * 从上游源码提取 Codex prompt 内容
 * 用于同步上游 prompt 内容到 resources/prompts/codex.txt
 */
const fs = require('fs')
const { execSync } = require('child_process')

const content = execSync('git show upstream/main:src/routes/openaiRoutes.js', {
  encoding: 'utf8'
})

// 找到 req.body.instructions = 后面的完整字符串
const startIdx = content.indexOf('req.body.instructions =')
if (startIdx === -1) {
  console.error('❌ 找不到 req.body.instructions')
  process.exit(1)
}

// 从 = 后面找到第一个双引号
const afterEquals = content.substring(startIdx + 23) // 跳过 'req.body.instructions ='
const quoteStart = afterEquals.indexOf('"')
if (quoteStart === -1) {
  console.error('❌ 找不到字符串开始')
  process.exit(1)
}

// 找到字符串的结束位置（匹配的双引号，跳过转义的）
let i = quoteStart + 1
while (i < afterEquals.length) {
  if (afterEquals[i] === '\\' && i + 1 < afterEquals.length) {
    i += 2 // 跳过转义字符
  } else if (afterEquals[i] === '"') {
    break
  } else {
    i++
  }
}

const rawString = afterEquals.substring(quoteStart, i + 1) // 包含引号

// 使用 JSON.parse 来正确解析 JavaScript 字符串
try {
  const parsed = JSON.parse(rawString)

  // 写入到 resources/prompts/codex.txt
  const outputPath = process.argv[2] || 'resources/prompts/codex_test.txt'
  fs.writeFileSync(outputPath, parsed)

  const lines = parsed.split('\n').length
  console.log('✅ Success!')
  console.log('📊 Size:', parsed.length, 'characters')
  console.log('📝 Lines:', lines)
  console.log('📁 Output:', outputPath)
  console.log('🔤 First line:', parsed.split('\n')[0].substring(0, 80) + '...')
} catch (e) {
  console.error('❌ JSON parse error:', e.message)
  process.exit(1)
}
