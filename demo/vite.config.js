import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    base: '/pars-calendar/',
    resolve: {
        alias: {
            '@': resolve(__dirname, '../src')
        },
        dedupe: ['vue']
    },
    optimizeDeps: {
        include: ['vue', 'lucide-vue-next']
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            external: [],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    },
    server: {
        port: 3000,
        open: true
    }
})
