import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      include: /\.(mdx|js|jsx|ts|tsx)$/,
      babel: {
        plugins: [path.resolve(__dirname, 'vite.config.plugin.js')],
      },
    }),
  ],
  server: {
    port: 3333,
  },
})
