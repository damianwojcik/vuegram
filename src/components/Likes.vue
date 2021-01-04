<template>
  <div class="likes">
    <a @click="likePost(post.id)">
      <span v-bind:class="[post.likes.includes(userProfile.id) ? 'liked' : '']"
        >❤</span
      >
    </a>
    <div class="counter">
      <span v-if="post.likes.length === 0"> {{ post.likes.length }} likes</span>
      <a v-else @click="toggleLikesModal(post.likes)">
        {{ post.likes.length }} likes
      </a>
    </div>
    <transition name="fade">
      <div v-if="showLikesModal" class="likesModal">
        <a @click="closeLikesModal()" class="close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="#000"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
        <h5>Likes:</h5>
        <ul>
          <li v-for="user in likesUsers" :key="user.id">
            {{ user.name }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { usersCollection } from '@/firebase'

export default {
  props: {
    post: Object
  },
  setup() {
    const store = useStore()
    const userProfile = computed(() => store.state.userProfile)
    const showLikesModal = ref(false)
    const likesUsers = ref([])

    function likePost(postId) {
      store.dispatch('likePost', postId)
    }

    function toggleLikesModal(likes) {
      showLikesModal.value = true

      likes.forEach(async (like) => {
        const doc = await usersCollection.doc(like).get()
        const user = { id: like, ...doc.data() }
        likesUsers.value.unshift(user)
      })
    }

    function closeLikesModal() {
      showLikesModal.value = ''
      likesUsers.value = []
    }

    return {
      userProfile,
      showLikesModal,
      likePost,
      toggleLikesModal,
      closeLikesModal,
      likesUsers
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.likes {
  position: relative;
  display: inline-flex;

  span {
    display: block;
    font-style: italic;
    font-size: 12px;
    margin-bottom: 0.5rem;
    color: darken($light, 25%);
  }

  span.liked {
    color: red;
  }

  .counter {
    margin-left: 0.5rem;
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

    ul {
      margin: 0;
      padding: 0;
    }

    ul li {
      display: block;
      margin-bottom: 3px;
    }
    .close {
      position: absolute;
      right: 2rem;
      top: 2rem;

      svg {
        width: 20px;
        height: 20px;
        fill: $black;
      }

      &:hover {
        color: #000;
        svg {
          fill: rgba(0, 0, 0, 0.5);
        }
      }
    }
  }
}
</style>
