import { createStore } from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

export default createStore({
  state: {
    userProfile: {}
  },
  mutations: {
    setUserProfile(state, payload) {
      state.userProfile = payload
    }
  },
  actions: {
    async login({ dispatch }, form) {
      const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
      dispatch('fetchUserProfile', user)
    },
    async fetchUserProfile({ commit }, user) {
      const userProfile = await fb.usersCollection.doc(user.uid).get()
      commit('setUserProfile', userProfile.data())
      router.push('/')
    },
    async signup({ dispatch }, form) {
      const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
    
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
        title: form.title
      })
    
      dispatch('fetchUserProfile', user)
    }
  },
  modules: {
  }
})
