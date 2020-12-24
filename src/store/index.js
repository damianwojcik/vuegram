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

fb.usersCollection.onSnapshot(snapshot => {
  let usersArray = [];

  snapshot.forEach(doc => {
    let user = doc.data()
    user.id = doc.id

    usersArray.push(user)
  })

  store.commit('setUsers', usersArray)
})

const store = createStore({
  state: {
    userProfile: {},
    posts: [],
    users: []
  },
  mutations: {
    setUserProfile(state, payload) {
      state.userProfile = payload
    },
    setPosts(state, payload) {
      state.posts = payload
    },
    setUsers(state, payload) {
      state.users = payload
    }
  },
  actions: {
    async login({ dispatch }, form) {
      const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
      dispatch('fetchUserProfile', user)
    },
    async fetchUserProfile({ commit }, user) {
      const userProfile = await fb.usersCollection.doc(user.uid).get()
      commit('setUserProfile', { id:user.uid, ...userProfile.data()})
      if (router.currentRoute.value.path === '/login') {
        router.push('/')
      }
    },
    async signup({ dispatch }, form) {
      const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
    
      await fb.usersCollection.doc(user.uid).set({
        photo: '',
        username: '',
        email: form.email,
        name: form.name,
        title: '',
        phone: form.phone
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
        comments: [],
        likes: [],
        visibleComments: false
      })
    },
    // eslint-disable-next-line no-unused-vars
    async likePost ({ commit }, postId) {
      const userId = fb.auth.currentUser.uid
      const post = await fb.postsCollection.doc(postId).get();
      const likesArr = post.data().likes

      if (likesArr.includes(userId)) { 
        await fb.postsCollection.doc(postId).update({
          likes: likesArr.filter(val => val !== userId)
        })
       } else {
        await fb.postsCollection.doc(postId).update({
          likes: likesArr.concat(userId).slice(0)
        })
       }
    },
    async addComment({ state }, { post, comment }) {
      const userId = fb.auth.currentUser.uid
      const userName = state.userProfile.name
      
      const newComment = {
        createdOn: new Date(),
        content: comment,
        postId: post.id,
        userId,
        userName
      }

      await fb.commentsCollection.add(newComment)
      await fb.postsCollection.doc(post.id).update({
        comments: [newComment, ...post.comments]
      })
    },
    async updateProfile({ dispatch }, user) {
      const userId = fb.auth.currentUser.uid
      await fb.usersCollection.doc(userId).update({
        username: user.username,
        name: user.name,
        title: user.title,
        email: user.email,
        phone: user.phone,
      })
    
      dispatch('fetchUserProfile', { uid: userId })
    
      const postDocs = await fb.postsCollection.where('userId', '==', userId).get()
      postDocs.forEach(doc => {
        fb.postsCollection.doc(doc.id).update({
          userName: user.name
        })
      })
    
      const commentDocs = await fb.commentsCollection.where('userId', '==', userId).get()
      commentDocs.forEach(doc => {
        fb.commentsCollection.doc(doc.id).update({
          userName: user.name
        })
      })
    }
  },
  modules: {
  }
})

export default store