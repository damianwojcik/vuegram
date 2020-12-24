<template>
  <div class="dashboard">
    <section>
      <div class="col1">
        <div class="profile">
          <div class="text-center">
            <img
              class="profile__avatar"
              :alt="`${userProfile.name} photo`"
              :src="
                userProfile.photo
                  ? userProfile.photo
                  : require(`../assets/images/avatar-placeholder.jpg`)
              "
            />
          </div>
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
                :close="togglePostModal"
                :getUserData="getUserData"
              ></FullPost>
            </transition>
            <div class="row">
              <img
                class="post__avatar"
                :alt="`${getUserData(post).userName} photo`"
                :src="
                  getUserData(post).userPhoto
                    ? getUserData(post).userPhoto
                    : require(`../assets/images/avatar-placeholder.jpg`)
                "
              />
              <h5>{{ post.userName }}</h5>
            </div>
            <span>{{ formatDate(post.createdOn) }}</span>
            <p>{{ trimmContent(post.content) }}</p>
            <ul>
              <li>
                <Likes :post="post" />
              </li>
              <li>
                <a @click="toggleCommentModal(post)"
                  >{{ post.comments.length }} comments</a
                >
              </li>
              <li><a @click="togglePostModal(post)">view full post</a></li>
              <li v-if="post.userId === userProfile.id">
                <DeletePost :post="post" />
              </li>
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
import { useStore } from 'vuex'
import moment from 'moment'
import CreatePost from '@/components/CreatePost'
import CommentModal from '@/components/CommentModal'
import CommentsList from '@/components/CommentsList'
import FullPost from '@/components/FullPost'
import Likes from '@/components/Likes'
import DeletePost from '@/components/DeletePost'

export default {
  components: {
    CreatePost,
    CommentModal,
    FullPost,
    Likes,
    CommentsList,
    DeletePost
  },
  setup() {
    const store = useStore()
    const userProfile = computed(() => store.state.userProfile)
    const posts = computed(() => store.state.posts)
    const users = computed(() => store.state.users)
    const showCommentModal = ref(false)
    const showPostModal = ref('')

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

    function togglePostModal(post) {
      showPostModal.value = post.id
    }

    function closePostModal() {
      showPostModal.value = false
    }

    function getUserData(post) {
      const user = users.value.filter((user) => user.id === post.userId)[0]
      const userName = user && user.name ? user.name : ''
      const userPhoto = user && user.photo ? user.photo : ''

      return {
        userName,
        userPhoto
      }
    }

    return {
      userProfile,
      posts,
      users,
      formatDate,
      trimmContent,
      toggleCommentModal,
      togglePostModal,
      closePostModal,
      showCommentModal,
      showPostModal,
      getUserData
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.dashboard {
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

    &__avatar {
      display: inline-block;
      margin-bottom: 20px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
    }

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

    .row {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      h5 {
        margin: 0 0 0 5px;
      }
    }

    &__avatar {
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }

    &:hover {
      background: #f5f8fa;
    }

    &:last-of-type {
      border-bottom: 1px solid $light;
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
</style>
