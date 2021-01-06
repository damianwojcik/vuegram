<template>
  <div class="dashboard">
    <section>
      <div class="col1">
        <div class="wrapper">
          <div class="profile" v-if="user">
            <div class="text-center">
              <img
                class="profile__avatar"
                :alt="`${user.name} photo`"
                :src="
                  user.photo
                    ? user.photo
                    : require(`../assets/images/avatar-placeholder.jpg`)
                "
              />
            </div>
            <h5>{{ user.name }}</h5>
            <h4 v-if="user.username">({{ user.username }})</h4>
            <p v-if="user.title">{{ user.title }}</p>
            <span v-if="user.hometown">{{ user.hometown }}</span>
            <a :href="'mailto: ' + user.email">{{ user.email }}</a>
          </div>
        </div>
      </div>
      <div class="col2">
        <div v-if="userPosts.length && areFriends">
          <div v-for="post in userPosts" :key="post.id" class="post">
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
              <h5>
                {{
                  getUserData(post).userUsername
                    ? getUserData(post).userUsername
                    : post.userName
                }}
              </h5>
            </div>
            <span>{{ formatDate(post.createdOn) }}</span>
            <p>{{ trimmContent(post.content) }}</p>
          </div>
        </div>
        <div v-else-if="!areFriends && user">
          <div class="know-friend">
            <div class="know-friend__wrap">
              <h3>Do you know {{ user.name }}?</h3>
              <p>
                To see what this user shares with friends, send friend request.
              </p>
            </div>
            <div class="know-friends__button-wrap">
              <div
                class="tooltip-wrap"
                v-if="
                  user.friends.filter(
                    (friend) =>
                      friend.userId === currentUser.id &&
                      friend.status === 'request'
                  ).length === 0
                "
              >
                <Tooltip :msg="'Add friend'" />
                <a @click="addFriend(user.id)" class="button">
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
              </div>
              <div class="tooltip-wrap" v-else>
                <Tooltip :msg="'Cancel friend request'" />
                <a @click="addFriend(user.id)" class="button button--light">
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
        </div>
        <div v-else>
          <p class="no-results">This user didn't add any post yet.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import moment from 'moment'
import Tooltip from '@/components/Tooltip'

export default {
  components: {
    Tooltip
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const posts = computed(() => store.state.posts)
    const users = computed(() => store.state.users)
    const currentUser = computed(() => store.state.userProfile)
    const userId = computed(() => route.params.userId).value
    const user = computed(
      () => users.value.filter((user) => user.id === userId)[0]
    )
    const userPosts = computed(() =>
      posts.value.filter((post) => post.userId === userId)
    )
    const areFriends = computed(() =>
      user.value
        ? user.value.friends.some(
            (friend) =>
              friend.userId === currentUser.value.id &&
              friend.status === 'accepted'
          )
        : false
    )

    if (!user.value) {
      router.push('/404')
    }

    function getUserData(post) {
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

    function addFriend(userId) {
      store.dispatch('addFriend', userId)
    }

    return {
      currentUser,
      user,
      userPosts,
      areFriends,
      formatDate,
      trimmContent,
      getUserData,
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

  .profile {
    margin-bottom: 20px;

    &__avatar {
      display: inline-block;
      margin-bottom: 20px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
    }

    h4 {
      font-size: 0.8rem;
    }

    p {
      color: $medium;
    }

    span {
      font-size: 15px;
      color: $secondary-text;
    }
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
