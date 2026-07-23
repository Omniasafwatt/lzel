import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import type { Plugin } from 'vite'

function imageResizePlugin(maxPx = 1400): Plugin {
  return {
    name: 'vite-image-resize',
    async generateBundle(_, bundle) {
      const { default: sharp } = await import('sharp')
      await Promise.all(
        Object.values(bundle).map(async (asset) => {
          if (asset.type !== 'asset') return
          if (!/\.(png|jpe?g|webp)$/i.test(asset.fileName)) return
          try {
            asset.source = await sharp(Buffer.from(asset.source as Buffer))
              .resize({ width: maxPx, height: maxPx, fit: 'inside', withoutEnlargement: true })
              .toBuffer()
          } catch { /* skip non-image assets that slip through */ }
        })
      )
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    imageResizePlugin(1400),
    ViteImageOptimizer({
      logStats: false,
      png:  { quality: 80 },
      jpg:  { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80, lossless: false },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          ui: ['framer-motion', 'lucide-react', 'sonner'],
          charts: ['recharts'],
          stripe: ['@stripe/react-stripe-js', '@stripe/stripe-js'],
        },
      },
    },
  },
})
