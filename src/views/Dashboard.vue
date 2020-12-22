<template>
  <div id="dashboard">
    <section>
      <div class="col1">
        <div class="profile">
          <h5>{{ userProfile.name }}</h5>
          <p>{{ userProfile.title }}</p>
          <div class="create-post">
            <p>create a post</p>
            <form @submit.prevent>
              <textarea v-model.trim="newPost.content"></textarea>
              <button
                @click="createPost()"
                :disabled="newPost.content === ''"
                class="button"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="col2">
        <div v-if="posts.length">
          <div v-for="post in posts" :key="post.id" class="post">
            <transition name="fade">
              <FullPost
                v-if="showPostModal === post.id"
                :post="post"
                :formatDate="formatDate"
                :likePost="likePost"
                :close="togglePostModal"
              ></FullPost>
            </transition>
            <h5>{{ post.userName }}</h5>
            <span>{{ formatDate(post.createdOn) }}</span>
            <p>{{ trimmContent(post.content) }}</p>
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
                <a v-else @click="toggleLikesModal(post.id, post.likes)">
                  {{ post.likes.length }} likes
                </a>
                <div v-if="showLikesModal === post.id" class="likesModal">
                  <a @click="closeLikesModal()" class="close">&times;</a>
                  <h5>Likes:</h5>
                  <ul>
                    <li v-for="user in likesUsers" :key="user.id">
                      {{ user.name }}
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <a @click="toggleCommentModal(post)"
                  >{{ post.comments.length }} comments</a
                >
              </li>
              <li><a @click="togglePostModal(post)">view full post</a></li>
            </ul>
            <transition name="fade">
              <CommentModal
                v-if="post.visibleComments"
                :post="post"
                :toggle="toggleCommentModal"
              ></CommentModal>
            </transition>
            <transition name="fade">
              <CommentsList
                v-if="post.visibleComments && post.comments.length"
                :postComments="post.comments"
                :formatDate="formatDate"
              />
            </transition>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts</p>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { ref, computed } from 'vue'
import { usersCollection } from '@/firebase'
import { useStore } from 'vuex'
import moment from 'moment'
import CommentModal from '@/components/CommentModal'
import CommentsList from '@/components/CommentsList'
import FullPost from '@/components/FullPost'

export default {
  components: {
    CommentModal,
    FullPost,
    CommentsList
  },
  setup() {
    const store = useStore()
    const userProfile = computed(() => store.state.userProfile)
    const posts = computed(() => store.state.posts)
    const likesUsers = ref([])
    const newPost = ref({ content: '' })
    const showCommentModal = ref(false)
    const showPostModal = ref('')
    const showLikesModal = ref('')

    function createPost() {
      store.dispatch('createPost', { content: newPost.value.content })
      newPost.value.content = ''
    }

    function formatDate(val) {
      if (!val) {
        return '-'
      }

      let date = val.toDate()
      return moment(date).fromNow()
    }

    function trimmContent(val) {
      if (val.length < 200) {
        return val
      }
      return `${val.substring(0, 200)}...`
    }

    function toggleCommentModal(post) {
      post.visibleComments = !post.visibleComments
    }

    function toggleLikesModal(postId, likes) {
      showLikesModal.value = postId

      likes.forEach(async (like) => {
        const doc = await usersCollection.doc(like).get()
        const user = { id: like, ...doc.data() }
        likesUsers.value.unshift(user)
      })
    }

    function likePost(postId) {
      store.dispatch('likePost', postId)
    }

    async function togglePostModal(post) {
      showPostModal.value = post.id
    }

    function closePostModal() {
      showPostModal.value = false
    }

    function closeLikesModal() {
      showLikesModal.value = ''
      likesUsers.value = []
    }

    return {
      userProfile,
      posts,
      createPost,
      formatDate,
      trimmContent,
      toggleCommentModal,
      toggleLikesModal,
      likePost,
      togglePostModal,
      closePostModal,
      closeLikesModal,
      newPost,
      showCommentModal,
      showPostModal,
      showLikesModal,
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
