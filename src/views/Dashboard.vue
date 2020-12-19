<template>
  <div id="dashboard">
    <transition name="fade">
      <CommentModal
        v-if="showCommentModal"
        :post="selectedPost"
        @close="toggleCommentModal()"
      ></CommentModal>
    </transition>
    <section>
      <div class="col1">
        <div class="profile">
          <h5>{{ userProfile.name }}</h5>
          <p>{{ userProfile.title }}</p>
          <div class="create-post">
            <p>create a post</p>
            <form @submit.prevent>
              <textarea v-model.trim="post.content"></textarea>
              <button
                @click="createPost()"
                :disabled="post.content === ''"
                class="button"
              >
                post
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="col2">
        <div v-if="posts.length">
          <div v-for="post in posts" :key="post.id" class="post">
            <h5>{{ post.userName }}</h5>
            <span>{{ formatDate(post.createdOn) }}</span>
            <p>{{ trimmContent(post.content) }}</p>
            <ul>
              <li>
                <a @click="toggleCommentModal(post)"
                  >comments {{ post.comments }}</a
                >
              </li>
              <li>
                <a @click="likePost(post.id, post.likes)"
                  >likes {{ post.likes }}</a
                >
              </li>
              <li><a @click="viewPost(post)">view full post</a></li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts</p>
        </div>
      </div>
    </section>

    <!-- full post modal -->
    <transition name="fade">
      <div v-if="showPostModal" class="p-modal">
        <div class="p-container">
          <a @click="closePostModal()" class="close">close</a>
          <div class="post">
            <h5>{{ fullPost.userName }}</h5>
            <span>{{ formatDate(fullPost.createdOn) }}</span>
            <p>{{ fullPost.content }}</p>
            <ul>
              <li>
                <a>comments {{ fullPost.comments }}</a>
              </li>
              <li>
                <a>likes {{ fullPost.likes }}</a>
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
  </div>
</template>
<script>
import { ref, computed } from 'vue'
import { commentsCollection } from '@/firebase'
import { useStore } from 'vuex'
import moment from 'moment'
import CommentModal from '@/components/CommentModal'

export default {
  components: {
    CommentModal
  },
  setup() {
    const store = useStore()
    const userProfile = computed(() => store.state.userProfile)
    const posts = computed(() => store.state.posts)
    const post = ref({ content: '' })
    const selectedPost = ref({})
    const fullPost = ref({})
    const postComments = ref([])
    const showCommentModal = ref(false)
    const showPostModal = ref(false)

    function createPost() {
      store.dispatch('createPost', { content: post.value.content })
      post.value.content = ''
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
      showCommentModal.value = !showCommentModal.value

      if (showCommentModal.value) {
        selectedPost.value = post
      } else {
        selectedPost.value = {}
      }
    }

    function likePost(id, likesCount) {
      store.dispatch('likePost', { id, likesCount })
    }

    async function viewPost(post) {
      const docs = await commentsCollection.where('postId', '==', post.id).get()

      docs.forEach((doc) => {
        let comment = doc.data()
        comment.id = doc.id
        postComments.value.push(comment)
      })

      fullPost.value = post
      showPostModal.value = true
    }

    function closePostModal() {
      postComments.value = []
      showPostModal.value = false
    }

    return {
      userProfile,
      posts,
      createPost,
      formatDate,
      trimmContent,
      toggleCommentModal,
      likePost,
      viewPost,
      closePostModal,
      post,
      selectedPost,
      fullPost,
      postComments,
      showCommentModal,
      showPostModal
    }
  }
}
</script>
