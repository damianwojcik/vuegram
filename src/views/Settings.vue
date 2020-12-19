<template>
  <section id="settings">
    <div class="col1">
      <h3>Settings</h3>
      <p>Update your profile</p>

      <transition name="fade">
        <p v-if="showSuccess" class="success">profile updated</p>
      </transition>

      <form @submit.prevent>
        <label for="name">Name</label>
        <input
          v-model.trim="name"
          type="text"
          :placeholder="userProfile.name"
          id="name"
        />

        <label for="title">Job Title</label>
        <input
          v-model.trim="title"
          type="text"
          :placeholder="userProfile.title"
          id="title"
        />

        <button @click="updateProfile()" class="button">Update Profile</button>
      </form>
    </div>
  </section>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const userProfile = computed(() => store.state.userProfile)
    const name = ref('')
    const title = ref('')
    const showSuccess = ref(false)

    function updateProfile() {
      store.dispatch('updateProfile', {
        name: name.value !== '' ? name.value : userProfile.value.name,
        title: title.value !== '' ? title.value : userProfile.value.title
      })

      name.value = ''
      title.value = ''

      showSuccess.value = true

      setTimeout(() => {
        showSuccess.value = false
      }, 2000)
    }

    return {
      userProfile,
      name,
      title,
      showSuccess,
      updateProfile
    }
  }
}
</script>
