import { createApp } from 'vue'
import './css/reset.css'
import './css/normalise.css'
import App from './App.vue'
import router from './router/router.js'

createApp(App).use(router).mount('#app')
