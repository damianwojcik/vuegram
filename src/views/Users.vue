<template>
  <transition name="fade">
    <div v-if="modalVisible" class="modal" @click="toggleModalVisibility()">
      <div class="modal-content" @click.stop>
        <div @click="toggleModalVisibility()" class="close">
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
        </div>
        <h3>Delete friend</h3>
        <p>
          Do you really want to delete
          <strong>{{ selectedUser.name }}</strong> from friends?
        </p>
        <div class="buttons">
          <button @click="toggleModalVisibility()" class="button button--gray">
            Cancel
          </button>
          <button @click="removeFriend(selectedUser.id)" class="button">
            Delete
          </button>
        </div>
      </div>
    </div>
  </transition>
  <div class="container">
    <div class="container-wrap" v-if="requestedUsers.length">
      <h3>Requests</h3>
      <ul>
        <li v-for="user in requestedUsers" :key="user.id">
          <router-link class="link-photo" :to="user.id">
            <img
              :alt="`${user.name} photo`"
              :src="
                user.photo
                  ? user.photo
                  : require(`../assets/images/avatar-placeholder.jpg`)
              "
              class="photo"
            />
          </router-link>
          <div class="wrapper">
            <router-link :to="user.id">
              <h5>{{ user.name }}</h5>
            </router-link>
            <div class="buttons">
              <button @click="acceptFriend(user.id)" class="button">
                Accept
              </button>
              <button
                @click="removeFriend(user.id)"
                class="button button--gray"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- /.container-wrap -->
    <div class="container-wrap" v-if="filteredUsers.length">
      <h3>Users</h3>
      <ul>
        <li v-for="user in filteredUsers" :key="user.id">
          <router-link class="link-photo" :to="user.id">
            <img
              :alt="`${user.name} photo`"
              :src="
                user.photo
                  ? user.photo
                  : require(`../assets/images/avatar-placeholder.jpg`)
              "
              class="photo"
            />
          </router-link>
          <div class="wrap">
            <router-link :to="user.id">
              <h5>
                {{ user.name }}
              </h5>
            </router-link>
            <span v-if="user.username">({{ user.username }})</span>
          </div>
          <div
            class="tooltip-wrap"
            v-if="
              user.friends.filter(
                (friend) =>
                  friend.userId === userProfile.id &&
                  friend.status === 'request'
              ).length === 0
            "
          >
            <Tooltip :msg="'Add friend'" />
            <a
              @click="addFriend(user.id)"
              class="button button--gray button--circle"
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
            </a>
          </div>
          <div class="tooltip-wrap" v-else>
            <Tooltip :msg="'Cancel friend request'" />
            <a
              @click="addFriend(user.id)"
              class="button button--light button--circle"
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
            </a>
          </div>
        </li>
      </ul>
    </div>
    <p v-else>
      There are currently no users.
    </p>
    <!-- /.container-wrap -->
    <div class="container-wrap" v-if="friendsUsers.length">
      <h3>Friends</h3>
      <ul>
        <li v-for="user in friendsUsers" :key="user.id">
          <router-link class="link-photo" :to="user.id">
            <img
              :alt="`${user.name} photo`"
              :src="
                user.photo
                  ? user.photo
                  : require(`../assets/images/avatar-placeholder.jpg`)
              "
              class="photo"
            />
          </router-link>
          <div class="wrapper">
            <router-link :to="user.id">
              <h5>{{ user.name }}</h5>
            </router-link>
            <div class="buttons">
              <button
                @click="toggleModalVisibility(user.id, user.name)"
                class="button button--gray"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- /.container-wrap -->
  </div>
  <!-- /.container -->
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import Tooltip from '@/components/Tooltip'

export default {
  components: {
    Tooltip
  },
  setup() {
    const store = useStore()
    const modalVisible = ref(false)
    const selectedUser = ref({})
    const users = computed(() => store.state.users)
    const userProfile = computed(() => store.state.userProfile)
    const allUsers = computed(() =>
      users.value.filter((user) => user.id !== userProfile.value.id)
    )
    const requestedUsers = computed(() =>
      allUsers.value.filter((user) =>
        user.friends.some(
          (friend) =>
            friend.status === 'pending' &&
            friend.userId === userProfile.value.id
        )
      )
    )
    const friendsUsers = computed(() =>
      allUsers.value.filter((user) =>
        user.friends.some(
          (friend) =>
            friend.status === 'accepted' &&
            friend.userId === userProfile.value.id
        )
      )
    )

    const filteredUsers = computed(() =>
      allUsers.value.filter(
        (x) =>
          !requestedUsers.value.includes(x) && !friendsUsers.value.includes(x)
      )
    )

    function addFriend(userId) {
      store.dispatch('addFriend', userId)
    }

    function removeFriend(userId) {
      store.dispatch('removeFriend', userId)
      modalVisible.value = false
    }

    function acceptFriend(userId) {
      store.dispatch('acceptFriend', userId)
    }

    function toggleModalVisibility(userId, userName) {
      if (userId) {
        selectedUser.value.id = userId
      } else {
        selectedUser.value.id = ''
      }

      if (userName) {
        selectedUser.value.name = userName
      } else {
        selectedUser.value.name = ''
      }
      modalVisible.value = !modalVisible.value
    }

    return {
      userProfile,
      filteredUsers,
      requestedUsers,
      selectedUser,
      friendsUsers,
      addFriend,
      removeFriend,
      acceptFriend,
      modalVisible,
      toggleModalVisibility
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

h3 {
  font-size: 17px;
}

.buttons {
  display: flex;

  .button {
    &:not(:first-child) {
      margin-left: 10px;
    }
  }
}

.container {
  a h5 {
    color: $primary-text;
    font-size: 15px;

    &:hover {
      text-decoration: underline;
    }
  }

  span {
    font-size: 15px;
    color: $secondary-text;
  }

  &-wrap {
    margin-bottom: 30px;
  }

  .wrap {
    flex: 1;
    padding-right: 16px;
  }

  .link-photo {
    position: relative;
    display: block;

    &:after {
      content: '';
      display: block;
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 0;
      width: 60px;
      height: 60px;
      background: rgba(0, 0, 0, 0.1);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    &:hover {
      &:after {
        opacity: 1;
      }
    }
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    &:not(:last-child) {
      margin-bottom: 30px;
    }

    li {
      position: relative;
      display: flex;
      align-items: center;
      padding: 16px;
      background: $white;
      margin-bottom: 16px;
      border-radius: 8px;
      box-shadow: 0 1px 2px $shadow-2;

      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 12px;
      }
    }
  }
}
</style>
