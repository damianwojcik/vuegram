import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './firebase'
import './assets/scss/app.scss'

let app
auth.onAuthStateChanged((user) => {
  if(!app) {
    app = createApp(App).use(store).use(router).mount('#app')
  }

  if(user) {
    store.dispatch('fetchUsers')
    store.dispatch('fetchPosts')
    localStorage.setItem('user', user.uid)
    store.dispatch('fetchUserProfile', user)
  } else {
    localStorage.removeItem('user')
  }
})


