import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isMockEnabled = env.VITE_MOCK === 'true'

  console.log('=== Vite Config ===')
  console.log('Mode:', mode)
  console.log('VITE_MOCK:', env.VITE_MOCK)
  console.log('Mock Enabled:', isMockEnabled)
  console.log('===================')

  const plugins = [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ]

  // 只在启用 Mock 时添加插件
  if (isMockEnabled) {
    const { viteMockServe } = await import('vite-plugin-mock')
    plugins.push(
      viteMockServe({
        localEnabled: true,
        prodEnabled: false,
        logger: true,
        mockPath: 'src/mock',
      })
    )
  } else {
    console.log('Mock is DISABLED. All /api requests will be proxied to backend.')
  }

  return {
    base: './',
    plugins,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT) || 3000,
      open: false,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          // 确保代理配置正确
          secure: false,
          ws: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'echarts': ['echarts'],
          },
        },
      },
    },
  }
})
