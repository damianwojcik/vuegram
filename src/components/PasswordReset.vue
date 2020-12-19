<template>
  <div class="modal">
    <div class="modal-content">
      <div @click="$emit('close')" class="close">close</div>
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
