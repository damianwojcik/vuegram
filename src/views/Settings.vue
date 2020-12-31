<template>
  <div class="container settings">
    <div class="col1">
      <h3>Settings</h3>
      <p>Update your profile</p>

      <span class="errorMsg" v-if="errorMsg">{{ errorMsg }}</span>

      <transition name="fade">
        <p v-if="showSuccess" class="success">profile updated</p>
      </transition>

      <form @submit.prevent>
        <div class="photo-wrapper">
          <img
            class="avatar"
            :alt="`${userProfile.name} photo`"
            :src="
              userProfile.photo
                ? userProfile.photo
                : require(`../assets/images/avatar-placeholder.jpg`)
            "
          />

          <Loader v-if="isLoading" />
        </div>

        <label>Photo</label>
        <div class="fileUploader">
          <input
            ref="fileInput"
            class="fileUploader__input"
            type="file"
            accept="image/*"
            @change="uploadFile"
          />
          <button
            class="button fileUploader__button"
            @click="triggerFileUploader"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Uploading...</span>
            <span v-else>Change</span>
          </button>
        </div>

        <label for="username">Username</label>
        <input
          v-model.trim="username"
          type="text"
          :placeholder="userProfile.username"
          id="username"
        />

        <label for="name">Full name</label>
        <input
          v-model.trim="name"
          type="text"
          :placeholder="userProfile.name"
          id="name"
        />

        <label for="name">Hometown</label>
        <input
          v-model.trim="hometown"
          type="text"
          :placeholder="userProfile.hometown"
          id="hometown"
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

        <button @click="updateProfile()" class="button update">
          Update Profile
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { storageRef, usersCollection } from '@/firebase'
import Loader from '@/components/Loader'

export default {
  components: {
    Loader
  },
  setup() {
    const store = useStore()
    const userProfile = computed(() => store.state.userProfile)
    const username = ref('')
    const name = ref('')
    const title = ref('')
    const email = ref('')
    const phone = ref('')
    const hometown = ref('')
    const errorMsg = ref('')
    const imageData = ref(null)
    const fileInput = ref(null)
    const showSuccess = ref(false)
    const isLoading = ref(false)

    function updateProfile() {
      store.dispatch('updateProfile', {
        username:
          username.value !== '' ? username.value : userProfile.value.username,
        name: name.value !== '' ? name.value : userProfile.value.name,
        title: title.value !== '' ? title.value : userProfile.value.title,
        email: email.value !== '' ? email.value : userProfile.value.email,
        phone: phone.value !== '' ? phone.value : userProfile.value.phone,
        hometown:
          hometown.value !== '' ? hometown.value : userProfile.value.hometown
      })

      username.value = ''
      name.value = ''
      title.value = ''
      email.value = ''
      phone.value = ''
      hometown.value = ''

      showSuccess.value = true

      setTimeout(() => {
        showSuccess.value = false
      }, 2000)
    }

    function triggerFileUploader() {
      fileInput.value.click()
    }

    function uploadFile(event) {
      imageData.value = event.target.files[0]
      const ref = storageRef.child(userProfile.value.id).put(imageData.value)
      ref.on(
        `state_changed`,
        () => {
          isLoading.value = true
        },
        (error) => {
          errorMsg.value = error.message
          isLoading.value = false
        },
        () => {
          ref.snapshot.ref.getDownloadURL().then((url) => {
            const userId = userProfile.value.id
            userProfile.value.photo = url
            usersCollection.doc(userId).update({
              photo: url
            })
            isLoading.value = false
          })
        }
      )
    }

    return {
      userProfile,
      username,
      name,
      title,
      email,
      phone,
      hometown,
      imageData,
      showSuccess,
      updateProfile,
      uploadFile,
      triggerFileUploader,
      fileInput,
      isLoading,
      errorMsg
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.settings {
  background: $white;
  display: flex;

  .avatar {
    display: inline-block;
    margin-bottom: 20px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }

  form {
    margin-top: 2rem;
  }

  .success {
    color: $success;
    margin: 0.5rem 0 -2rem;
  }

  .update {
    margin-top: 1.5rem;
  }

  .fileUploader {
    position: relative;
    margin-bottom: 15px;

    &__input {
      opacity: 0;
      width: 150px;
      height: 48px;
      margin: 0;
      padding: 0;
    }

    &__button {
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .photo-wrapper {
    position: relative;
    width: 150px;
    height: 150px;
    margin-bottom: 20px;
  }
  .errorMsg {
    color: $error;
    font-weight: bold;
  }
}
</style>
