import { createApp } from 'vue'
import App from './App.vue'

import '~/styles/index.scss'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App);
// app.use(ElementPlus);
app.mount("#app");
//createApp(App).mount('#app')
