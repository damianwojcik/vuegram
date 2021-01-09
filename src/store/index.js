import { createStore } from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

const store = createStore({
  state: {
    userProfile: {},
    posts: [],
    users: [],
    error: null
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
    },
    setError(state, payload) {
      state.error = payload
    }
  },
  actions: {
    fetchPosts({ commit }) {
      fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
        let postsArray = []
      
        snapshot.forEach(doc => {
          let post = doc.data()
          post.id = doc.id
      
          postsArray.push(post)
        })
      
        commit('setPosts', postsArray)
      })
    },
    fetchUsers({ commit }) {
      fb.usersCollection.onSnapshot(snapshot => {
        let usersArray = [];
      
        snapshot.forEach(doc => {
          let user = doc.data()
          user.id = doc.id
      
          usersArray.push(user)
        })
      
        commit('setUsers', usersArray)
      })
    },
    async login({ commit, dispatch }, form) {
    commit('setError', null)
     await fb.auth.signInWithEmailAndPassword(form.email, form.password)
      .then((user) => dispatch('fetchUserProfile', user))
      .catch(error => commit('setError', error))
    },
    async fetchUserProfile({ commit }, user) {
      const userProfile = await fb.usersCollection.doc(user.uid).get()
      commit('setUserProfile', { id: user.uid, ...userProfile.data()})
      if (router.currentRoute.value.path === '/login') {
        router.push('/')
      }
    },
    async signup({ commit, dispatch }, form) {
      commit('setError', null)

      try {
        const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)

        try {
          await fb.usersCollection.doc(user.uid).set({
            photo: '',
            username: '',
            email: form.email,
            name: form.name,
            title: '',
            phone: '',
            hometown: '',
            friends: []
          })
        
          dispatch('fetchUserProfile', user)
        } catch(error) {
          commit('setError', error)
        }
      } catch(error) {
        commit('setError', error)
      }
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
        visibleComments: false,
        commentsDisabled: post.commentsDisabled
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
    // eslint-disable-next-line no-unused-vars
    async deletePost({commit}, postId) {
      // TODO: add snackbar with message instead of console.log
      await fb.postsCollection.doc(postId).delete()
      .then(() => console.log('Document successfully deleted!'))
      .catch(error => console.log('Error removing document: ', error))
    },
    // eslint-disable-next-line no-unused-vars
    async updatePost({commit}, { postId, content, commentsDisabled }) {
      // TODO: add snackbar with message instead of console.log
      await fb.postsCollection.doc(postId).update({
        content,
        commentsDisabled
      })
    },
    async removeFriend({ state }, targetUserId) {
      const currentUserId = state.userProfile.id
      const currentUserFriends = state.userProfile.friends
      const targetUser = await fb.usersCollection.doc(targetUserId).get()
      const targetUserFriends = targetUser.data().friends
      const filteredTargetUserFriends = targetUserFriends.filter(friend => friend.userId !== currentUserId)
      const filteredCurrentUserFriends = currentUserFriends.filter(friend => friend.userId !== targetUserId)

      await fb.usersCollection.doc(targetUserId).update({
        friends: filteredTargetUserFriends
      })

      await fb.usersCollection.doc(currentUserId).update({
        friends: filteredCurrentUserFriends
      })
    },
    async addFriend({ state }, targetUserId) {
      const currentUserId = state.userProfile.id
      const currentUserFriends = state.userProfile.friends
      const targetUser = await fb.usersCollection.doc(targetUserId).get()
      const targetUserFriends = targetUser.data().friends

      if(targetUserFriends.filter(friend => friend.userId === currentUserId).length > 0
        || currentUserFriends.filter(friend => friend.userId === targetUserId).length > 0) {
        const filteredTargetUserFriends = targetUserFriends.filter(friend => friend.userId !== currentUserId)
        const filteredCurrentUserFriends = currentUserFriends.filter(friend => friend.userId !== targetUserId)

        await fb.usersCollection.doc(targetUserId).update({
          friends: filteredTargetUserFriends
        })

        await fb.usersCollection.doc(currentUserId).update({
          friends: filteredCurrentUserFriends
        })

        return
      }

      await fb.usersCollection.doc(targetUserId).update({
          friends: [...targetUserFriends, {
            userId: currentUserId,
            status: 'request'
          }]
        })

      await fb.usersCollection.doc(currentUserId).update({
        friends: [...currentUserFriends, {
          userId: targetUserId,
          status: 'pending'
        }]
      })
    },
    async acceptFriend({ state }, targetUserId) {
      const currentUserId = state.userProfile.id
      const currentUserFriends = await (await fb.usersCollection.doc(currentUserId).get()).data().friends
      const targetUser = await fb.usersCollection.doc(targetUserId).get()
      const targetUserFriends = targetUser.data().friends

      currentUserFriends.forEach(friend => {
        if (friend.userId === targetUserId) {
          friend.status = "accepted"
        }
      })

      targetUserFriends.forEach(friend => {
        if (friend.userId === currentUserId) {
          friend.status = "accepted"
        }
      })

      await fb.usersCollection.doc(currentUserId).update({
        friends: currentUserFriends
      })

      await fb.usersCollection.doc(targetUserId).update({
        friends: targetUserFriends
      })
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
        hometown: user.hometown,
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