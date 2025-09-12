import App from './App.vue'
import './style.css'
import { ViteSSG } from 'vite-ssg/single-page'

export const createApp = ViteSSG(App)
