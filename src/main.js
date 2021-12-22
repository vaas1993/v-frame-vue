import { createApp, reactive } from 'vue'
import App from './App.vue'
import LoadElement from './configs/element'
import VFrame from "@vshen/v-frame-core/lib/VFrame"
import Router from './configs/router'
import '@vshen/v-frame-core/styles/helper.css'
import './styles/iconfont.css'

let app = createApp(App)

LoadElement(app)
app.use(Router)
window.getApp = () => app
VFrame.getInstance().vue(app, reactive).then(() => {
    app.mount('#app')
})