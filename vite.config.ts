import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, 'src/shared'),
      '@blocks': resolve(__dirname, 'src/blocks'),
      '@core': resolve(__dirname, 'src/core'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@mocks': resolve(__dirname, 'src/mocks'),
      '@pages': resolve(__dirname, 'src/pages'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
