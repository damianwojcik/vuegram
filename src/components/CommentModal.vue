<template>
  <div class="c-container">
    <a @click="$emit('close')">close</a>
    <p>add a comment</p>
    <form @submit.prevent>
      <textarea v-model.trim="comment"></textarea>
      <button @click="addComment()" :disabled="comment == ''" class="button">
        add comment
      </button>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { commentsCollection, postsCollection, auth } from '@/firebase'

export default {
  props: {
    post: Object
  },
  setup(props, { emit }) {
    const store = useStore()
    const comment = ref('')
    const userName = computed(() => store.state.userProfile.name).value

    async function addComment() {
      await commentsCollection.add({
        createdOn: new Date(),
        content: comment.value,
        postId: props.post.id,
        userId: auth.currentUser.uid,
        userName: userName
      })

      await postsCollection.doc(props.post.id).update({
        comments: parseInt(props.post.comments) + 1
      })

      emit('close')
    }

    return {
      comment,
      addComment
    }
  }
}
</script>
