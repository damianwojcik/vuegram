<template>
  <div class="create-post">
    <p>create a post</p>
    <form @submit.prevent>
      <textarea v-model.trim="newPost.content"></textarea>
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

    function createPost() {
      store.dispatch('createPost', { content: newPost.value.content })
      newPost.value.content = ''
    }

    return {
      newPost,
      createPost
    }
  }
}
</script>

<style lang="scss" scoped>
.create-post {
  p {
    margin-bottom: 0.5rem;
  }

  textarea {
    height: 200px;
    margin: 0;
  }

  .button {
    margin-top: 1rem;
    width: 100%;
    z-index: 5;
    border-radius: 0 0 3px 3px;
  }
}
</style>
