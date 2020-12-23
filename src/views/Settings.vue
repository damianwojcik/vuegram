<template>
  <section id="settings">
    <div class="col1">
      <h3>Settings</h3>
      <p>Update your profile</p>

      <transition name="fade">
        <p v-if="showSuccess" class="success">profile updated</p>
      </transition>

      <form @submit.prevent>
        <label for="photo">Photo</label>
        <input
          v-model.trim="photo"
          type="text"
          :placeholder="userProfile.photo"
          id="photo"
        />

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

        <label for="email">E-mail address</label>
        <input
          v-model.trim="email"
          type="email"
          :placeholder="userProfile.email"
          id="email"
        />

        <label for="email">Phone number</label>
        <input
          v-model.trim="phone"
          type="number"
          :placeholder="userProfile.phone"
          id="phone"
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
    const photo = ref('')
    const name = ref('')
    const title = ref('')
    const email = ref('')
    const phone = ref('')
    const showSuccess = ref(false)

    function updateProfile() {
      store.dispatch('updateProfile', {
        photo: photo.value !== '' ? photo.value : userProfile.value.photo,
        name: name.value !== '' ? name.value : userProfile.value.name,
        title: title.value !== '' ? title.value : userProfile.value.title,
        email: email.value !== '' ? email.value : userProfile.value.email,
        phone: phone.value !== '' ? phone.value : userProfile.value.phone
      })

      photo.value = ''
      name.value = ''
      title.value = ''
      email.value = ''
      phone.value = ''

      showSuccess.value = true

      setTimeout(() => {
        showSuccess.value = false
      }, 2000)
    }

    return {
      userProfile,
      photo,
      name,
      title,
      email,
      phone,
      showSuccess,
      updateProfile
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

#settings {
  padding: 2rem 0;

  .col1 {
    max-width: 600px;
    margin: 5vh auto 0;
    background: $white;
    padding: 2rem;
  }

  form {
    margin-top: 3rem;
  }

  .success {
    color: $success;
    margin: 0.5rem 0 -2rem;
  }

  .button {
    margin-top: 2rem;
  }
}
</style>
