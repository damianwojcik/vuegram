<template>
  <div id="dashboard">
    <section>
      <div class="col1">
        <div class="profile">
          <h5>{{ userProfile.name }}</h5>
          <p>{{ userProfile.title }}</p>
          <CreatePost />
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
import CreatePost from '@/components/CreatePost'
import CommentModal from '@/components/CommentModal'
import CommentsList from '@/components/CommentsList'
import FullPost from '@/components/FullPost'

export default {
  components: {
    CreatePost,
    CommentModal,
    FullPost,
    CommentsList
  },
  setup() {
    const store = useStore()
    const userProfile = computed(() => store.state.userProfile)
    const posts = computed(() => store.state.posts)
    const likesUsers = ref([])
    const showCommentModal = ref(false)
    const showPostModal = ref('')
    const showLikesModal = ref('')

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
      formatDate,
      trimmContent,
      toggleCommentModal,
      toggleLikesModal,
      likePost,
      togglePostModal,
      closePostModal,
      closeLikesModal,
      showCommentModal,
      showPostModal,
      showLikesModal,
      likesUsers
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

#dashboard {
  section {
    padding: 2rem 0;
  }

  .col1 {
    flex: 0 0 30%;

    @media screen and (max-width: 1000px) {
      flex: 0 0 40%;
    }
  }

  .profile {
    background: $white;
    padding: 2rem;

    p {
      color: $medium;
      margin-bottom: 1rem;
    }
  }

  .hidden-posts {
    text-align: center;
    border: 1px solid #e6ecf0;
    font-size: 14px;
    border-bottom: 0;
    background: $white;

    &:hover {
      background: #f5f8fa;
      cursor: pointer;
    }

    .new-posts {
      color: $primary;
    }

    p {
      padding: 15px;
      margin: 0 auto;
      color: darken($light, 25%);
    }
  }

  .post {
    border: 1px solid #e6ecf0;
    border-bottom: 0;
    font-size: 14px;
    padding: 1.5rem;
    background: $white;

    &:hover {
      background: #f5f8fa;
    }

    &:last-of-type {
      border-bottom: 1px solid $light;
    }

    h5 {
      margin: 0 0 0.5rem;
    }

    span {
      display: block;
      font-style: italic;
      font-size: 12px;
      margin-bottom: 0.5rem;
      color: darken($light, 25%);
    }

    p {
      margin: 0;
    }

    ul {
      list-style: none;
      margin: 1rem 0 0;
      padding: 0;

      li {
        display: inline-block;
        margin-right: 1rem;
        font-size: 12px;
      }
    }
  }

  .no-results {
    border: 1px solid #e6ecf0;
    background: $white;
    text-align: center;
    padding: 100px 1rem;
  }
}
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
