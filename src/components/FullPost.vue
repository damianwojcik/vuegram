<template>
  <div class="p-modal" @click="close()" v-if="post">
    <div class="p-container" @click.stop>
      <a @click="close()" class="close">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#000">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
      <div class="post">
        <div class="row">
          <img
            class="post__avatar"
            :alt="`${getUserData(post.id).userName} photo`"
            :src="
              getUserData(post.id).userPhoto
                ? getUserData(post.id).userPhoto
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
    postId: String,
    formatDate: Function,
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
  setup(props) {
    const store = useStore()
    const posts = computed(() => store.state.posts)
    const userProfile = computed(() => store.state.userProfile)
    const showLikesInnerModal = ref(false)
    const likesUsers = ref([])
    const showCommentModal = ref(false)
    const post = computed(
      () => posts.value.filter((post) => post.id === props.postId)[0]
    )

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
      post,
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

  svg {
    width: 20px;
    height: 20px;
    fill: $black;
  }

  &:hover {
    color: #000;
    svg {
      fill: rgba(0, 0, 0, 0.5);
    }
  }
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
      top: 20px;
      right: 20px;
      padding: 5px;

      svg {
        width: 20px;
        height: 20px;
        fill: $black;
      }

      &:hover {
        color: #000;
        svg {
          fill: rgba(0, 0, 0, 0.5);
        }
      }
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
