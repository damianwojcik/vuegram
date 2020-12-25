<template>
  <div class="create-post">
    <h3>Create a post</h3>
    <form @submit.prevent>
      <label for="content">Content</label>
      <textarea
        id="content"
        name="content"
        v-model.trim="newPost.content"
      ></textarea>
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
      <button
        @click="createPost()"
        :disabled="newPost.content === ''"
        class="button"
      >
        Post
      </button>
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
.create-post {
  h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 0.5rem;
  }

  .checkbox-wrapper {
    display: flex;
    align-items: center;

    input {
      margin-right: 10px;
    }

    label {
      margin: 0;
    }
  }

  textarea {
    height: 200px;
    margin: 0 0 15px 0;
  }

  .button {
    margin-top: 1rem;
    width: 100%;
    z-index: 5;
    border-radius: 0 0 3px 3px;
  }
}
</style>
