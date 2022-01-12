import { createApp } from 'vue'
import App from './App.vue'
import Enhance from '@/tools/enhance.js'
import store from '@/store'
const app = createApp(App)
app.use(store)
app.use(Enhance)
app.mount('#app')
