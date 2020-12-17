import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './firebase'

auth.onAuthStateChanged(() => createApp(App).use(store).use(router).mount('#app'))


