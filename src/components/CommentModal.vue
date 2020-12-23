<template>
  <div class="comment-modal">
    <ul class="header">
      <li>
        <h3>Add a comment</h3>
      </li>
      <li>
        <a @click="toggle(post)" class="close">&times;</a>
      </li>
    </ul>
    <form @submit.prevent>
      <textarea v-model.trim="comment"></textarea>
      <button
        @click="addComment(post, comment)"
        :disabled="comment == ''"
        class="button"
      >
        add comment
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    post: Object,
    toggle: Function
  },
  setup(props) {
    const store = useStore()
    const comment = ref('')

    function addComment(post, comment) {
      store.dispatch('addComment', { post, comment })

      if (props.toggle) {
        props.toggle(post)
      }
    }

    return {
      comment,
      addComment
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.header {
  display: flex;
  justify-content: space-between;
  list-style: none;
  margin: 0;
  padding: 0;
  margin-top: 30px;
}
</style>
