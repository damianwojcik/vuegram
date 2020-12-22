<template>
  <div class="c-container">
    <a @click="toggle(post)">close</a>
    <p>add a comment</p>
    <form @submit.prevent>
      <textarea v-model.trim="comment"></textarea>
      <button
        @click="addComment(post)"
        :disabled="comment == ''"
        class="button"
      >
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
    post: Object,
    toggle: Function
  },
  setup(props) {
    const store = useStore()
    const comment = ref('')
    const userName = computed(() => store.state.userProfile.name).value

    async function addComment(post) {
      const newComment = {
        createdOn: new Date(),
        content: comment.value,
        postId: post.id,
        userId: auth.currentUser.uid,
        userName: userName
      }
      await commentsCollection.add(newComment)
      await postsCollection.doc(post.id).update({
        comments: [newComment, ...post.comments]
      })

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
