<template>
  <div class="container">
    <h3>Users</h3>
    <ul v-if="filteredUsers.length">
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
          <h5>
            <router-link :to="user.id">
              {{ user.name }}
            </router-link>
          </h5>
          <span v-if="user.username">({{ user.username }})</span>
        </div>
        <div
          v-if="
            user.friends.filter((friend) => friend.userId === userProfile.id)
              .length === 0
          "
        >
          <a
            @click="addFriend(user.id)"
            class="user-button"
            title="Add user to friends"
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
        <div v-else>
          <!-- TODO: add hover tooltip -->
          <a
            @click="addFriend(user.id)"
            class="user-button user-pending"
            title="Cancel request to friends"
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
    <p v-else>
      There are currently no users.
    </p>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const users = computed(() => store.state.users)
    const userProfile = computed(() => store.state.userProfile)
    const filteredUsers = computed(() =>
      users.value.filter((user) => user.id !== userProfile.value.id)
    )

    function addFriend(userId) {
      store.dispatch('addFriend', userId)
    }

    return {
      userProfile,
      filteredUsers,
      addFriend
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

h3 {
  padding: 16px 16px 16px 0;
  font-size: 17px;
}

.container {
  h5 a {
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

      svg {
        width: 20px;
        height: 20px;
        fill: $black;
      }

      .user-button {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        z-index: 9;
        padding: 3px;
        background: $secondary-button-background;

        &:hover {
          background: darken($secondary-button-background, 10%);
        }

        &.user-pending {
          background: $primary-button-background;

          &:hover {
            background: darken($primary-button-background, 5%);
          }

          svg {
            fill: $primary;
          }
        }
      }
    }
  }
}
</style>
