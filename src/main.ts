import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import {  Calendar } from 'v-calendar';

const app = createApp(App)
app.component('Calendar', Calendar)
app.use(router).use(ElementPlus).mount('#app')