<template>
  <transition name="fade">
    <div class="p-modal">
      <div class="p-container">
        <a @click="$emit('close')" class="close">&times;</a>
        <div class="post">
          <h5>{{ post.userName }}</h5>
          <span>{{ formatDate(post.createdOn) }}</span>
          <p>{{ post.content }}</p>
          <ul>
            <li>
              <a @click="likePost(post.id)">
                <span
                  v-bind:class="[
                    post.likes.includes(userProfile.id) ? 'liked' : ''
                  ]"
                  >❤</span
                >
              </a>
            </li>
            <li>
              <span v-if="post.likes.length === 0">
                {{ post.likes.length }} likes</span
              >
              <a v-else @click="toggleLikesInnerModal(post.likes)">
                {{ post.likes.length }} likes
              </a>
              <div v-if="showLikesInnerModal" class="likesModal">
                <a @click="closeLikesInnerModal()" class="close">&times;</a>
                <h5>Likes:</h5>
                <ul>
                  <li v-for="user in likesUsers" :key="user.id">
                    {{ user.name }}
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <a>{{ post.comments }} comments</a>
            </li>
          </ul>
        </div>
        <div v-show="postComments.length" class="comments">
          <div
            v-for="comment in postComments"
            :key="comment.id"
            class="comment"
          >
            <p>{{ comment.userName }}</p>
            <span>{{ formatDate(comment.createdOn) }}</span>
            <p>{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { usersCollection } from '@/firebase'

export default {
  props: {
    post: Object,
    postComments: Object,
    formatDate: Function,
    likePost: Function
  },
  setup() {
    const store = useStore()
    const userProfile = computed(() => store.state.userProfile)
    const showLikesInnerModal = ref(false)
    const likesUsers = ref([])

    function toggleLikesInnerModal(likes) {
      showLikesInnerModal.value = !showLikesInnerModal.value

      likes.forEach(async (like) => {
        const doc = await usersCollection.doc(like).get()
        const user = { id: like, ...doc.data() }
        likesUsers.value.unshift(user)
      })
    }

    function closeLikesInnerModal() {
      showLikesInnerModal.value = false
      likesUsers.value = []
    }

    return {
      userProfile,
      toggleLikesInnerModal,
      closeLikesInnerModal,
      showLikesInnerModal,
      likesUsers
    }
  }
}
</script>

<style lang="scss" scoped>
#dashboard .post span.liked {
  color: red;
}
.post ul li {
  position: relative;
}
#dashboard .post .likesModal ul li {
  display: block;
}
#dashboard .post .likesModal .close {
  position: absolute;
  right: 2rem;
  top: 2rem;
}
.likesModal {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 0 20px 0 rgba(52, 73, 94, 0.5);
  overflow: auto;
  padding: 2rem;
  width: 300px;
  height: 150px;
  z-index: 99;
}
</style>
