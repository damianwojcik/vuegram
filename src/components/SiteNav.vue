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
          <router-link to="/settings">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#000"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
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
