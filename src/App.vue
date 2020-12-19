<template>
  <div id="app">
    <SiteNav v-if="Object.keys(userProfile).length > 1"></SiteNav>
    <router-view />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import SiteNav from '@/components/SiteNav'

export default {
  components: {
    SiteNav
  },
  setup() {
    const store = useStore()
    const userProfile = computed(() => store.state.userProfile)

    return {
      userProfile
    }
  }
}
</script>
