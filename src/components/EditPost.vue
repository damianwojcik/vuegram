<template>
  <div class="edit-post">
    <transition name="fade">
      <div class="modal" v-if="isModalVisible" @click="toggleModal">
        <div class="modal-content" @click.stop>
          <div @click="toggleModal" class="close">&times;</div>
          <h3>Edit post</h3>
          <textarea :value="post.content" @input="updateContent"></textarea>
          <div class="checkbox-wrapper">
            <input
              type="checkbox"
              id="cmmentsDisabled"
              name="commentsDisabled"
              :checked="post.commentsDisabled"
              @click="toggleCommentsDisabled"
            />
            <label for="cmmentsDisabled">Disable comments</label>
          </div>
          <ul class="buttons">
            <li>
              <button class="button button--error" @click="toggleModal">
                Cancel
              </button>
            </li>
            <li>
              <button
                class="button"
                @click="updatePost(post.id, content, commentsDisabled)"
              >
                Save
              </button>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <a title="Edit post" @click="toggleModal">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#000">
        <path
          d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
        />
      </svg>
    </a>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    post: Object
  },
  setup(props) {
    const store = useStore()
    const isModalVisible = ref(false)
    const content = ref(props.post.content)
    const commentsDisabled = ref(false)

    function toggleModal() {
      isModalVisible.value = !isModalVisible.value
    }

    function updatePost(postId, content, commentsDisabled) {
      store.dispatch('updatePost', { postId, content, commentsDisabled })
      isModalVisible.value = false
    }

    function updateContent(event) {
      content.value = event.target.value
    }

    function toggleCommentsDisabled(event) {
      commentsDisabled.value = event.target.checked
    }

    return {
      isModalVisible,
      toggleModal,
      updatePost,
      updateContent,
      content,
      commentsDisabled,
      toggleCommentsDisabled
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.edit-post {
  position: relative;
  width: 20px;
  height: 20px;
  top: 5px;

  svg {
    fill: $primary;
  }
}

.modal {
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(#333, 0.5);
  z-index: 99;

  .modal-content {
    position: relative;
    margin: auto;
    width: 100%;
    max-width: 600px;
    background: #fff;
    padding: 40px;
    border-radius: 5px;
    box-shadow: 0 0 5px 0 rgba(#333, 0.5);
    z-index: 999;
  }

  h3 {
    margin-bottom: 30px;
  }

  textarea {
    margin-bottom: 20px;
  }

  .checkbox-wrapper {
    display: flex;
    margin-bottom: 20px;
    align-items: center;

    input {
      margin-right: 10px;
    }
  }

  .buttons {
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
    justify-content: space-between;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px;
    cursor: pointer;
    transition: 0.15s;

    &:hover {
      color: #000;
    }
  }
}
</style>
