import { createApp } from 'vue'
import '@/assets/css/reset.css'
import '@/assets/css/normalise.css'
import naive from "naive-ui";
import App from './App.vue'
import router from './router/router.js'

createApp(App).use(router).use(naive).mount('#app')
