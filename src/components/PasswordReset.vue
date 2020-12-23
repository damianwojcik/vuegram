<template>
  <div class="modal" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div @click="$emit('close')" class="close">&times;</div>
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

<style lang="scss" scoped>
.modal {
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(#333, 0.5);

  .modal-content {
    position: relative;
    margin: auto;
    width: 100%;
    max-width: 400px;
    background: #fff;
    padding: 40px;
    border-radius: 5px;
    box-shadow: 0 0 5px 0 rgba(#333, 0.5);
    z-index: 999;

    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 5px;
      cursor: pointer;
      transition: 0.15s;

      &:hover {
        color: #000;
      }
    }

    h3 {
      margin: 0;
    }

    p {
      margin: 15px 0;
    }

    .error {
      color: tomato;
      font-size: 12px;
    }

    .button {
      width: 100%;
    }
  }
}
</style>
