<template>
  <div class="create-post">
    <h3>Create a post</h3>
    <form @submit.prevent>
      <textarea
        id="content"
        name="content"
        v-model.trim="newPost.content"
      ></textarea>
      <footer>
        <button
          @click="createPost()"
          :disabled="newPost.content === ''"
          class="button"
        >
          Post
        </button>
        <div class="checkbox-wrapper">
          <input
            type="checkbox"
            id="commentsDisabled"
            name="commentsDisabled"
            v-model="commentsDisabled"
            @click="!commentsDisabled"
          />
          <label for="commentsDisabled">Disable comments</label>
        </div>
      </footer>
    </form>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref } from 'vue'

export default {
  setup() {
    const store = useStore()
    const newPost = ref({ content: '' })
    const commentsDisabled = ref(false)

    function createPost() {
      store.dispatch('createPost', {
        content: newPost.value.content,
        commentsDisabled: commentsDisabled.value
      })
      newPost.value.content = ''
      commentsDisabled.value = false
    }

    return {
      newPost,
      createPost,
      commentsDisabled
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.create-post {
  background: $white;
  padding: 1.5rem;

  &:hover {
    background: $light;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }

  footer {
    display: flex;
    align-items: center;
    margin-top: 1rem;
  }

  .checkbox-wrapper {
    display: inline-flex;
    align-items: center;
    margin-left: 20px;

    input {
      margin-right: 5px;
    }

    label {
      margin: 0;
      font-size: 14px;
    }
  }

  textarea {
    height: 100px;
    margin: 0 0 15px 0;
  }

  .button {
    display: inline-flex;
  }
}
</style>
