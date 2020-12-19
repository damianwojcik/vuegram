import { createStore } from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
  let postsArray = []

  snapshot.forEach(doc => {
    let post = doc.data()
    post.id = doc.id

    postsArray.push(post)
  })

  store.commit('setPosts', postsArray)
})

const store = createStore({
  state: {
    userProfile: {},
    posts: []
  },
  mutations: {
    setUserProfile(state, payload) {
      state.userProfile = payload
    },
    setPosts(state, payload) {
      state.posts = payload
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
      if (router.currentRoute.value.path === '/login') {
        router.push('/')
      }
    },
    async signup({ dispatch }, form) {
      const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
    
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
        title: form.title
      })
    
      dispatch('fetchUserProfile', user)
    },
    async logout({ commit }) {
      await fb.auth.signOut()
    
      commit('setUserProfile', {})
      router.push('/login')
    },
    async createPost({ state }, post) {
      await fb.postsCollection.add({
        createdOn: new Date(),
        content: post.content,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        comments: 0,
        likes: 0
      })
    },
    // eslint-disable-next-line no-unused-vars
    async likePost ({ commit }, post) {
      const userId = fb.auth.currentUser.uid
      const docId = `${userId}_${post.id}`
      const doc = await fb.likesCollection.doc(docId).get()

      if (doc.exists) { return }
    
      await fb.likesCollection.doc(docId).set({
        postId: post.id,
        userId: userId
      })
    
      fb.postsCollection.doc(post.id).update({
        likes: post.likesCount + 1
      })
    }
  },
  modules: {
  }
})

export default store