<template>
  <div id="dashboard">
    <transition name="fade">
      <FullPost
        v-if="showPostModal"
        :post="selectedPost"
        :formatDate="formatDate"
        :likePost="likePost"
        :postComments="postComments"
        @close="togglePostModal()"
      ></FullPost>
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
                Post
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
                  >comments {{ post.comments }}</a
                >
              </li>
              <li><a @click="togglePostModal(post)">view full post</a></li>
            </ul>
            <transition name="fade">
              <CommentModal
                v-if="showCommentModal && post.id === selectedPost.id"
                :post="selectedPost"
                @close="toggleCommentModal()"
              ></CommentModal>
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
import { usersCollection, commentsCollection } from '@/firebase'
import { useStore } from 'vuex'
import moment from 'moment'
import CommentModal from '@/components/CommentModal'
import FullPost from '@/components/FullPost'

export default {
  components: {
    CommentModal,
    FullPost
  },
  setup() {
    const store = useStore()
    const userProfile = computed(() => store.state.userProfile)
    const posts = computed(() => store.state.posts)
    const post = ref({ content: '' })
    const selectedPost = ref({})
    const postComments = ref([])
    const likesUsers = ref([])
    const showCommentModal = ref(false)
    const showPostModal = ref(false)
    const showLikesModal = ref('')

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

    function toggleLikesModal(postId, likes) {
      showLikesModal.value = postId

      likes.forEach(async (like) => {
        const doc = await usersCollection.doc(like).get()
        const user = { id: like, ...doc.data() }
        likesUsers.value.unshift(user)
      })
    }

    function likePost(postId) {
      const userId = userProfile.value.id
      store.dispatch('likePost', postId)

      if (Object.keys(selectedPost.value).length > 0) {
        const likesArr = Object.values(selectedPost.value.likes)
        if (likesArr.includes(userId)) {
          const filteredLikesArr = likesArr.filter((val) => val !== userId)
          selectedPost.value.likes = filteredLikesArr
        } else {
          likesArr.push(userId)
          selectedPost.value.likes = likesArr
        }
      }
    }

    async function togglePostModal(post) {
      showPostModal.value = !showPostModal.value

      if (post) {
        if (showPostModal.value) {
          selectedPost.value = post
        } else {
          selectedPost.value = {}
        }

        const docs = await commentsCollection
          .where('postId', '==', post.id)
          .get()

        docs.forEach((doc) => {
          let comment = doc.data()
          comment.id = doc.id
          postComments.value.push(comment)
        })
      }
    }

    function closePostModal() {
      showPostModal.value = false
      selectedPost.value = {}
      postComments.value = []
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
      post,
      selectedPost,
      postComments,
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
