<template>
  <div class="modal" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div @click="$emit('close')" class="close">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#000">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <h3>Reset Password</h3>
      <div v-if="!showSuccess">
        <p>Enter your email to reset your password</p>
        <form @submit.prevent>
          <input
            v-model.trim="email"
            type="email"
            placeholder="you@email.com"
          />
        </form>
        <p v-if="errorMsg !== ''" class="error">{{ errorMsg }}</p>
        <button @click="resetPassword()" class="button">Reset</button>
      </div>
      <p v-else>Success! Check your email for a reset link.</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { auth } from '@/firebase'

export default {
  setup() {
    const email = ref('')
    const showSuccess = ref(false)
    const errorMsg = ref('')

    async function resetPassword() {
      errorMsg.value = ''
      try {
        await auth.sendPasswordResetEmail(this.email)
        showSuccess.value = true
      } catch (err) {
        errorMsg.value = err.message
      }
    }

    return {
      email,
      showSuccess,
      errorMsg,
      resetPassword
    }
  }
}
</script>
