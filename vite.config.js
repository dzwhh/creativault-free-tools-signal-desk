import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

function sitesOutput() {
  return {
    name: 'creativault-sites-output',
    apply: 'build',
    async closeBundle() {
      const root = process.cwd()
      await mkdir(resolve(root, 'dist/server'), { recursive: true })
      await mkdir(resolve(root, 'dist/.openai'), { recursive: true })
      await copyFile(resolve(root, 'worker/index.js'), resolve(root, 'dist/server/index.js'))
      await copyFile(resolve(root, '.openai/hosting.json'), resolve(root, 'dist/.openai/hosting.json'))
    },
  }
}

export default defineConfig({
  plugins: [react(), sitesOutput()],
  build: { outDir: 'dist/client' },
  server: { port: 4173 },
  preview: { port: 4173 },
})
