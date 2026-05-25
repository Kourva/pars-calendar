import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

setTimeout(() => {
    const loading = document.getElementById('loading')
    if (loading) loading.style.display = 'none'
    document.getElementById('app').classList.add('visible')
}, 100)
