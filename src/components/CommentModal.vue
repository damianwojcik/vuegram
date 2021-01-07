<template>
  <div class="comment-modal">
    <ul class="header">
      <li>
        <h3>Add a comment</h3>
      </li>
      <li>
        <a @click="toggle(post)" class="close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="#000"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
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

textarea {
  margin-bottom: 20px;
}
.close {
  &:hover {
    svg {
      fill: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
