<template>
  <div class="users">
    <h3>Users</h3>
    <ul>
      <li v-for="user in users" :key="user.id">
        <router-link :to="user.id" class="user-link">
          <img
            :alt="`${user.name} photo`"
            :src="
              user.photo
                ? user.photo
                : require(`../assets/images/avatar-placeholder.jpg`)
            "
            class="photo"
          />
          <div class="wrap">
            <h5>{{ user.name }}</h5>
            <span v-if="user.username">({{ user.username }})</span>
            <a class="user-add" title="Add user to friends">
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
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const users = computed(() => store.state.users)

    return {
      users
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.users {
  position: relative;
  max-width: 600px;
  margin: 5vh auto 0;
  background: $white;
  padding-bottom: 2rem;

  h3 {
    padding: 2rem 2rem 20px 2rem;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      position: relative;

      svg {
        width: 20px;
        height: 20px;
        fill: $primary;
      }

      a.user-link {
        display: flex;
        align-items: center;
        padding: 20px 2rem;

        &:hover {
          background: #f5f8fa;
          .user-add {
            display: flex;
          }
        }
      }

      .wrap {
        position: relative;
      }

      .user-add {
        position: absolute;
        justify-content: center;
        align-items: center;
        border: 1px solid $primary;
        border-radius: 50%;
        right: -35px;
        top: -15px;
        display: none;
        z-index: 9;
        padding: 3px;

        &:hover {
          background: $primary;

          svg {
            fill: #fff;
          }
        }
      }

      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 20px;
      }
    }
  }
}
</style>
