import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    publicDir: 'public',
    base: '/',
    server: {
        host: true,
        port: 5173
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        copyPublicDir: true
    }
})
