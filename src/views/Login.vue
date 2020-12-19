<template>
  <div id="login">
    <PasswordReset
      v-if="showPasswordReset"
      @close="togglePasswordReset()"
    ></PasswordReset>
    <section>
      <div class="col1">
        <h1>Vuegram</h1>
        <p>
          Welcome to the
          <a href="https://savvyapps.com/" target="_blank">Savvy Apps</a> sample
          social media web app powered by Vue.js and Firebase. Build this
          project by checking out The Definitive Guide to Getting Started with
          Vue.js
        </p>
      </div>
      <div :class="{ 'signup-form': !showLoginForm }" class="col2">
        <form v-if="showLoginForm" @submit.prevent>
          <h1>Welcome Back</h1>
          <div>
            <label for="email1">Email</label>
            <input
              v-model.trim="loginForm.email"
              type="text"
              placeholder="you@email.com"
              id="email1"
            />
          </div>
          <div>
            <label for="password1">Password</label>
            <input
              v-model.trim="loginForm.password"
              type="password"
              placeholder="******"
              id="password1"
            />
          </div>
          <button @click="login()" class="button">Log In</button>
          <div class="extras">
            <a @click="togglePasswordReset()">Forgot Password</a>
            <a @click="toggleForm()">Create an Account</a>
          </div>
        </form>
        <form v-else @submit.prevent>
          <h1>Get Started</h1>
          <div>
            <label for="name">Name</label>
            <input
              v-model.trim="signupForm.name"
              type="text"
              placeholder="Savvy Apps"
              id="name"
            />
          </div>
          <div>
            <label for="title">Title</label>
            <input
              v-model.trim="signupForm.title"
              type="text"
              placeholder="Company"
              id="title"
            />
          </div>
          <div>
            <label for="email2">Email</label>
            <input
              v-model.trim="signupForm.email"
              type="text"
              placeholder="you@email.com"
              id="email2"
            />
          </div>
          <div>
            <label for="password2">Password</label>
            <input
              v-model.trim="signupForm.password"
              type="password"
              placeholder="min 6 characters"
              id="password2"
            />
          </div>
          <button @click="signup()" class="button">Sign Up</button>
          <div class="extras">
            <a @click="toggleForm()">Back to Log In</a>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import PasswordReset from '@/components/PasswordReset'

export default {
  components: {
    PasswordReset
  },
  setup() {
    const store = useStore()
    const loginForm = ref({ email: '', password: '' })
    const signupForm = ref({ name: '', title: '', email: '', password: '' })
    const showLoginForm = ref(true)
    const showPasswordReset = ref(false)

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
        name: signupForm.value.name,
        title: signupForm.value.title
      })
    }

    return {
      loginForm,
      signupForm,
      showLoginForm,
      showPasswordReset,
      toggleForm,
      togglePasswordReset,
      login,
      signup
    }
  }
}
</script>
