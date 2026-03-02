import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import './assets/index.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(MotionPlugin)

const authStore = useAuthStore()
authStore.initialize().finally(() => {
  app.mount('#app')
})
