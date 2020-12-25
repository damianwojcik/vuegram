<template>
  <transition name="fade">
    <div class="p-modal" @click="close(post.id)">
      <div class="p-container" @click.stop>
        <a @click="close(post.id)" class="close">&times;</a>
        <div class="post">
          <div class="row">
            <img
              class="post__avatar"
              :alt="`${getUserData(post).userName} photo`"
              :src="
                getUserData(post).userPhoto
                  ? getUserData(post).userPhoto
                  : require(`../assets/images/avatar-placeholder.jpg`)
              "
            />
            <h5>{{ post.userName }}</h5>
          </div>
          <span>{{ formatDate(post.createdOn) }}</span>
          <p>{{ post.content }}</p>
          <ul>
            <li>
              <Likes :post="post" />
            </li>
            <li v-if="!post.commentsDisabled">
              <span>{{ post.comments.length }}&nbsp;comments&nbsp;</span>
            </li>
            <li v-if="!post.commentsDisabled">
              <a @click="toggleCommentModal(post)">add comment</a>
            </li>
            <li v-else>
              <span>Comments disabled</span>
            </li>
            <li class="user-options" v-if="post.userId === userProfile.id">
              <EditPost :post="post" />
              <DeletePost :postId="post.id" />
            </li>
          </ul>
          <transition name="fade">
            <CommentModal
              v-if="showCommentModal"
              :post="post"
              :toggle="toggleCommentModal"
              :showCommentModal="showCommentModal"
            ></CommentModal>
          </transition>
        </div>
        <CommentsList
          v-if="post.comments.length && !post.commentsDisabled"
          :postComments="post.comments"
          :formatDate="formatDate"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { usersCollection } from '@/firebase'
import CommentModal from '@/components/CommentModal'
import CommentsList from '@/components/CommentsList'
import Likes from '@/components/Likes'
import DeletePost from '@/components/DeletePost'
import EditPost from '@/components/EditPost'

export default {
  props: {
    post: Object,
    formatDate: Function,
    likePost: Function,
    close: Function,
    getUserData: Function
  },
  components: {
    CommentModal,
    CommentsList,
    Likes,
    DeletePost,
    EditPost
  },
  setup() {
    const store = useStore()
    const userProfile = computed(() => store.state.userProfile)
    const showLikesInnerModal = ref(false)
    const likesUsers = ref([])
    const showCommentModal = ref(false)

    function toggleLikesInnerModal(likes) {
      showLikesInnerModal.value = !showLikesInnerModal.value

      likes.forEach(async (like) => {
        const doc = await usersCollection.doc(like).get()
        const user = { id: like, ...doc.data() }
        likesUsers.value.unshift(user)
      })
    }

    function closeLikesInnerModal() {
      showLikesInnerModal.value = false
      likesUsers.value = []
    }

    function toggleCommentModal() {
      showCommentModal.value = !showCommentModal.value
    }

    return {
      userProfile,
      toggleLikesInnerModal,
      closeLikesInnerModal,
      showLikesInnerModal,
      likesUsers,
      toggleCommentModal,
      showCommentModal
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

#dashboard .post span.liked {
  color: red;
}
.post {
  border: 1px solid #e6ecf0;
  border-bottom: 0;
  font-size: 14px;
  padding: 1.5rem;
  background: $white;

  // TOOD: DRY with Dashboard.vue
  .row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    h5 {
      margin: 0 0 0 5px;
    }
  }

  &__avatar {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  &:hover {
    background: #f5f8fa;
  }

  &:last-of-type {
    border-bottom: 1px solid $light;
  }

  span {
    display: block;
    font-style: italic;
    font-size: 12px;
    margin-bottom: 0.5rem;
    color: darken($light, 25%);
  }

  p {
    margin: 0;
  }

  ul {
    list-style: none;
    margin: 1rem 0 0;
    padding: 0;

    li {
      display: inline-block;
      margin-right: 1rem;
      font-size: 12px;

      &.user-options {
        display: inline-flex;

        *:nth-child(even) {
          margin-left: 5px;
        }
      }
    }
  }
}
.post ul {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;

  li {
    display: inline-block;
    margin-right: 1rem;
    font-size: 12px;
  }

  span {
    display: block;
    font-style: italic;
    font-size: 12px;
    margin-bottom: 0.5rem;
    color: darken($light, 25%);
  }
}
.post ul li {
  position: relative;
}
#dashboard .post .likesModal ul li {
  display: block;
}
#dashboard .post .likesModal .close {
  position: absolute;
  right: 2rem;
  top: 2rem;
}
.likesModal {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 0 20px 0 rgba(52, 73, 94, 0.5);
  overflow: auto;
  padding: 2rem;
  width: 300px;
  height: 150px;
  z-index: 99;
}

.p-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba($dark, 0.4);
  z-index: 999;

  .p-container {
    position: fixed;
    max-width: 600px;
    height: 500px;
    top: 2vh;
    bottom: 2vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 3px;
    background: $white;
    box-shadow: 0 0 20px 0 rgba($dark, 0.5);
    overflow: auto;

    .close {
      position: absolute;
      top: 5px;
      right: 10px;
      padding: 5px;
    }

    .post {
      border: 0;
      border-bottom: 1px solid #e6ecf0;

      &:hover {
        background: $white;
      }
    }
  }
}
</style>
