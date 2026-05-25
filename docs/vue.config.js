import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    base: '/pars-calendar/', // Replace with your repo name
    server: {
        port: 3000,
        open: true
    }
})
