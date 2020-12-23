<template>
  <header>
    <div class="col1">
      <router-link to="/">
        <h3>Vuegram</h3>
      </router-link>
      <ul class="inline">
        <li>
          <router-link to="/">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/settings">Settings</router-link>
        </li>
        <li><a @click="logout()">logout</a></li>
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

  ul {
    float: right;
    text-align: right;

    li {
      margin-top: 4px;
      margin-left: 6px;

      a {
        display: block;
        padding: 5px;
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
