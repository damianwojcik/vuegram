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
              placeholder="John Doe"
              id="name"
            />
          </div>
          <div>
            <label for="phone">Phone Number</label>
            <input
              v-model.trim="signupForm.phone"
              type="number"
              placeholder="123456789"
              id="phone"
            />
          </div>
          <div>
            <label for="email2">Email</label>
            <input
              v-model.trim="signupForm.email"
              type="text"
              placeholder="john@email.com"
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
    const signupForm = ref({ name: '', phone: '', email: '', password: '' })
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
        phone: signupForm.value.phone
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
</style>
