<template>
  <header>
    <div class="col1">
      <router-link to="/">
        <h3>Vuegram</h3>
      </router-link>
      <ul class="inline">
        <li>
          <router-link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#000"
            >
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
              />
            </svg>
            <span>Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/users">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#000"
            >
              <path
                d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
              />
            </svg>
            <span>Users</span>
          </router-link>
        </li>
        <li>
          <router-link to="/settings">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#000"
            >
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>
            <span>
              Settings
            </span>
          </router-link>
        </li>
        <li>
          <a @click="logout()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#000"
            >
              <path
                fill-rule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clip-rule="evenodd"
              />
            </svg>
            <span>
              Logout
            </span>
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    function logout() {
      store.dispatch('logout')
    }

    return {
      logout
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

header {
  position: relative;
  background: $white;
  box-shadow: 0 0 5px 0 rgba($dark, 0.5);
  z-index: 10;

  h3 {
    display: inline-block;
  }

  svg {
    fill: $primary;
    width: 20px;
    height: 20px;
  }

  ul {
    float: right;
    text-align: right;
    display: flex;

    li {
      display: inline-flex;
      align-items: center;
      margin-top: 4px;
      margin-left: 10px;

      a {
        display: inline-flex;
        padding: 5px;

        span {
          margin-left: 5px;
        }
      }
    }
  }

  @media screen and (max-width: 742px) {
    h3 {
      display: block;
      text-align: center;
    }

    ul {
      float: none;
      text-align: center;
    }
  }
}
</style>
