import { defineConfig, alias } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const srcPath = path.resolve(__dirname, 'src')

export default ({ mode }) => {
  const __DEV__ = mode === 'development'

  const alias = {
    '@/': `${path.resolve(__dirname, 'src')}/`,
  }

  if (__DEV__) {
    alias['vue-i18n'] = 'vue-i18n/dist/vue-i18n.cjs.js'
  }
  return defineConfig({
    server: {
      proxy: {
        '^/develop-api': {
          target: 'http://dotc-api.biglab.net/f/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/develop-api/, '')
        },
        '/f/com/upload': {
          target: 'http://dotc-api.biglab.net',
          changeOrigin: true
        }
      }
    },
    define: {
      'process.env': {
        BASE_URL: '/'
      }
    },
    plugins: [vue()],
    resolve: {
      // alias: [
      //   { find: '@', replacement: srcPath }
      // ]
      alias
    },
    css: {
      preprocessorOptions: {
        stylus: {
          // additionalData: './src/assets/css/common.styl'
        }
      },
      postcss: {
        plugins: [
          require('postcss-auto-rem')({size: 100}),
        ]
      }
    },
    build: {
      assetsInlineLimit: 1024 * 3
    }
  })
}
