import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    base: '/pars-calendar/',
    resolve: {
        alias: {
            '@': resolve(__dirname, '../src')
        }
    },
    optimizeDeps: {
        include: ['vue', 'lucide-vue-next']
    },
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            external: [],
            output: {
                manualChunks: undefined
            }
        }
    }
})
