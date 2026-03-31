// Mock 服务入口文件
// 所有 mock 模块会在此处统一导出

console.log('Mock services initialized')

// 导入所有 mock 模块
// Vite 会自动处理这些导入
import './_auth.js'
import './_homework.js'
import './_resource.js'
import './_report.js'
import './_cockpit.js'
import './_system.js'
