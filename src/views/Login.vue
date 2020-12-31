<template>
  <div class="login">
    <PasswordReset
      v-if="showPasswordReset"
      @close="togglePasswordReset()"
    ></PasswordReset>
    <section>
      <div class="col1">
        <h1>Vuegram</h1>
        <p>
          Welcome to the sample social media web app powered by Vue.js and
          Firebase.
        </p>
      </div>
      <div :class="{ 'signup-form': !showLoginForm }" class="col2">
        <form v-if="showLoginForm" @submit.prevent>
          <h1>Welcome Back</h1>
          <div
            class="field"
            :class="{
              'field--error': error && error.code === 'auth/user-not-found'
            }"
          >
            <label for="email1">Email</label>
            <input
              v-model.trim="loginForm.email"
              type="text"
              placeholder="you@email.com"
              id="email1"
            />
            <span
              class="error"
              v-if="error && error.code === 'auth/user-not-found'"
              >{{ error.message }}</span
            >
          </div>
          <div
            class="field"
            :class="{
              'field--error': error && error.code === 'auth/wrong-password'
            }"
          >
            <label for="password1">Password</label>
            <input
              v-model.trim="loginForm.password"
              type="password"
              placeholder="******"
              id="password1"
            />
            <span
              class="error"
              v-if="error && error.code === 'auth/wrong-password'"
              >{{ error.message }}</span
            >
          </div>
          <div class="buttons-wrapper">
            <button @click="login()" class="button">Log In</button>
            <div class="extras">
              <a @click="togglePasswordReset()">Forgot Password</a>
              <a @click="toggleForm()">Create an Account</a>
            </div>
          </div>
        </form>
        <form v-else @submit.prevent="checkForm">
          <h1>Get Started</h1>
          <div
            class="field"
            :class="{
              'field--error': error && error.code === 'name/required'
            }"
          >
            <label for="name">Name</label>
            <input
              v-model.trim="signupForm.name"
              type="text"
              placeholder="John Doe"
              id="name"
            />
            <span
              class="error"
              v-if="error && error.code === 'name/required'"
              >{{ error.message }}</span
            >
          </div>
          <div
            class="field"
            :class="{
              'field--error':
                (error && error.code === 'auth/email-already-in-use') ||
                (error && error.code === 'auth/invalid-email')
            }"
          >
            <label for="email2">Email</label>
            <input
              v-model.trim="signupForm.email"
              type="text"
              placeholder="john@email.com"
              id="email2"
            />
            <span
              class="error"
              v-if="
                (error && error.code === 'auth/email-already-in-use') ||
                  (error && error.code === 'auth/invalid-email')
              "
              >{{ error.message }}</span
            >
          </div>
          <div
            class="field"
            :class="{
              'field--error': error && error.code === 'auth/weak-password'
            }"
          >
            <label for="password2">Password</label>
            <input
              v-model.trim="signupForm.password"
              type="password"
              placeholder="min 6 characters"
              id="password2"
            />
            <span
              class="error"
              v-if="error && error.code === 'auth/weak-password'"
              >{{ error.message }}</span
            >
          </div>
          <div class="buttons-wrapper">
            <button class="button">Sign Up</button>
            <div class="extras">
              <a @click="toggleForm()">Back to Log In</a>
            </div>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import PasswordReset from '@/components/PasswordReset'

export default {
  components: {
    PasswordReset
  },
  setup() {
    const store = useStore()
    const loginForm = ref({ email: '', password: '' })
    const signupForm = ref({ name: '', email: '', password: '' })
    const showLoginForm = ref(true)
    const showPasswordReset = ref(false)
    const error = computed(() => store.state.error)

    function toggleForm() {
      showLoginForm.value = !showLoginForm.value
    }

    function togglePasswordReset() {
      showPasswordReset.value = !showPasswordReset.value
    }

    function login() {
      store.dispatch('login', {
        email: loginForm.value.email,
        password: loginForm.value.password
      })
    }

    function signup() {
      store.dispatch('signup', {
        email: signupForm.value.email,
        password: signupForm.value.password,
        name: signupForm.value.name
      })
    }

    function checkForm() {
      // fields validation
      if (!signupForm.value.name) {
        store.commit('setError', {
          code: 'name/required',
          message: 'Name is required.'
        })
      } else {
        store.commit('setError', null)
        signup()
        return true
      }
    }

    return {
      loginForm,
      signupForm,
      showLoginForm,
      showPasswordReset,
      toggleForm,
      togglePasswordReset,
      login,
      signup,
      error,
      checkForm
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.login {
  background: linear-gradient(
    to right,
    $primary 0%,
    $primary 50%,
    $white 50%,
    $white 100%
  );

  @media screen and (max-width: 742px) {
    height: 100vh;
    background: $white;
  }

  .col1,
  .col2 {
    height: 100vh;
    padding-top: 30vh;
    @media screen and (max-width: 742px) {
      height: auto;
      padding-top: 20vh;
    }
  }

  .col1 {
    color: $white;
    @media screen and (max-width: 742px) {
      display: none;
    }

    p {
      max-width: 490px;
      margin-top: 2rem;
      line-height: 1.8;
    }

    a {
      color: $white;
      text-decoration: underline;
    }
  }

  .signup-form {
    padding-top: 20vh;
    @media screen and (max-width: 742px) {
      padding-top: 10vh;
    }
  }

  .col2 {
    h1 {
      margin-bottom: 2rem;
    }

    form {
      max-width: 450px;
      margin: 0 auto;
    }

    .extras {
      float: right;
      text-align: right;

      a {
        display: block;
        margin-bottom: 0.5rem;
      }
    }
  }
}

.buttons-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field {
  margin-bottom: 1rem;

  &--error {
    color: $error;

    input {
      border-color: $error;
    }
  }
}
</style>
