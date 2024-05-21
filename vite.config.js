import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [path.resolve(__dirname, 'vite.config.plugin.js')],
      },
    }),
  ],
  server: {
    port: 3333,
  },
})
