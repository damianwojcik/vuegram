<template>
  <transition name="fade">
    <FullPost
      v-if="selectedPostId"
      :postId="selectedPostId"
      :formatDate="formatDate"
      :getUserData="getUserData"
      :close="closePostModal"
    ></FullPost>
  </transition>
  <div class="dashboard">
    <section>
      <div class="col1">
        <div class="wrapper">
          <Profile v-if="user" :user="user" />
        </div>
      </div>
      <div class="col2">
        <CreatePost v-if="currentUser" />
        <div
          v-if="
            (filteredPosts.length && currentUser) ||
              (filteredPosts.length && areFriends)
          "
        >
          <div v-for="post in filteredPosts" :key="post.id" class="post">
            <router-link :to="post.userId" class="row">
              <img
                class="post__avatar"
                :alt="`${getUserData(post.id).userName} photo`"
                :src="
                  getUserData(post.id).userPhoto
                    ? getUserData(post.id).userPhoto
                    : require(`../assets/images/avatar-placeholder.jpg`)
                "
              />
              <h5>
                {{
                  getUserData(post.id).userUsername
                    ? getUserData(post.id).userUsername
                    : post.userName
                }}
              </h5>
            </router-link>
            <span>{{ formatDate(post.createdOn) }}</span>
            <p>{{ trimmContent(post.content) }}</p>
            <ul>
              <li>
                <Likes :post="post" />
              </li>
              <li v-if="!post.commentsDisabled">
                <a @click="toggleCommentModal(post)"
                  >{{ post.comments.length }} comments</a
                >
              </li>
              <li v-else>
                <span>Comments disabled</span>
              </li>
              <li><a @click="selectPost(post.id)">view full post</a></li>
              <li class="user-options" v-if="post.userId === userProfile.id">
                <EditPost :post="post" />
                <DeletePost :postId="post.id" />
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
        <div v-else-if="!areFriends && user && !currentUser">
          <div class="know-friend">
            <div class="know-friend__wrap">
              <h3>Do you know {{ user.name }}?</h3>
              <p>
                To see what this user shares with friends, send friend request.
              </p>
            </div>
            <div class="know-friends__button-wrap">
              <a
                @click="addFriend(user.id)"
                class="button"
                v-if="
                  user.friends.filter(
                    (friend) =>
                      friend.userId === userProfile.id &&
                      friend.status === 'request'
                  ).length === 0
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#000"
                >
                  <path
                    d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"
                  />
                </svg>
                Add Friend
              </a>
              <a
                @click="addFriend(user.id)"
                class="button button--light"
                v-else
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#000"
                >
                  <path
                    d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z"
                  />
                </svg>
                Cancel Request
              </a>
            </div>
          </div>
        </div>

        <div v-else-if="!currentUser">
          <p class="no-results">There are currently no posts.</p>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { ref, computed, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import moment from 'moment'
import Profile from '@/components/Profile'
import CreatePost from '@/components/CreatePost'
import CommentModal from '@/components/CommentModal'
import CommentsList from '@/components/CommentsList'
import FullPost from '@/components/FullPost'
import Likes from '@/components/Likes'
import DeletePost from '@/components/DeletePost'
import EditPost from '@/components/EditPost'

export default {
  components: {
    Profile,
    CreatePost,
    CommentModal,
    FullPost,
    Likes,
    CommentsList,
    DeletePost,
    EditPost
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const userId = computed(() => route.params.userId).value
    const userProfile = computed(() => store.state.userProfile)
    const posts = computed(() => store.state.posts)
    const users = computed(() => store.state.users)
    const showCommentModal = ref(false)
    const selectedPostId = ref('')
    let user
    let currentUser
    let userFriends
    let filteredPosts
    let areFriends

    if (userId && users.value) {
      user = computed(() => users.value.filter((user) => user.id == userId)[0])
      currentUser = false
      filteredPosts = computed(() =>
        posts.value.filter((post) => post.userId === userId)
      )
      areFriends = computed(() =>
        user.value
          ? user.value.friends.some(
              (friend) =>
                friend.userId === userProfile.value.id &&
                friend.status === 'accepted'
            )
          : false
      )
    } else {
      user = computed(
        () => users.value.filter((user) => user.id === userProfile.value.id)[0]
      )
      currentUser = true
      userFriends = computed(() =>
        user.value
          ? user.value.friends.map((element) =>
              element.status === 'accepted' ? element.userId : ''
            )
          : []
      )
      filteredPosts = computed(() =>
        posts.value && user.value
          ? posts.value.filter(
              (post) =>
                post.userId === user.value.id ||
                userFriends.value.some((friend) => friend === post.userId)
            )
          : []
      )
    }

    onUpdated(() => {
      if (!user.value && !currentUser) {
        router.push('/404')
      }
    })

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

    function selectPost(postId) {
      selectedPostId.value = postId
    }

    function closePostModal() {
      selectedPostId.value = ''
    }

    function addFriend(userId) {
      store.dispatch('addFriend', userId)
    }

    function getUserData(postId) {
      if (!postId) {
        return ''
      }
      const post = posts.value.filter((post) => post.id === postId)[0]
      const user = users.value.filter((user) => user.id === post.userId)[0]
      const userUsername = user && user.username ? user.username : ''
      const userName = user && user.name ? user.name : ''
      const userPhoto = user && user.photo ? user.photo : ''

      return {
        userUsername,
        userName,
        userPhoto
      }
    }

    return {
      user,
      userProfile,
      filteredPosts,
      users,
      selectedPostId,
      formatDate,
      trimmContent,
      toggleCommentModal,
      selectPost,
      closePostModal,
      showCommentModal,
      getUserData,
      areFriends,
      currentUser,
      addFriend
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

  .wrapper {
    background: $white;
    padding: 2rem;
  }

  .post {
    border: 1px solid #e6ecf0;
    border-bottom: 0;
    font-size: 14px;
    padding: 1.5rem;
    background: $white;

    .row {
      display: inline-flex;
      align-items: center;
      margin-bottom: 10px;
      color: $primary-text;
      font-size: 15px;

      &:hover {
        text-decoration: underline;
      }

      h5 {
        margin: 0 0 0 10px;
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
      display: flex;
      align-items: center;

      li {
        display: inline-block;
        margin-right: 1rem;
        font-size: 12px;

        &.user-options {
          display: inline-flex;

          *:nth-child(even) {
            margin-left: 5px;
          }
        }
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

.know-friend {
  background: $white;
  border-radius: 8px;
  box-shadow: 0 1px 2px $shadow-2;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: 20px;
    font-weight: 700;
    line-height: 24px;
    color: $primary-text;
    margin-bottom: 6px;
  }

  p {
    font-size: 17px;
    line-height: 20px;
    color: $secondary-text;
    margin: 0;
  }

  .button {
    padding: 8px 12px;
  }
}
</style>
