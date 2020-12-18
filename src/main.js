import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './firebase'
import './assets/scss/app.scss'

auth.onAuthStateChanged((user) => {
  createApp(App).use(store).use(router).mount('#app')

  if(user) {
    store.dispatch('fetchUserProfile', user)
  }
})


