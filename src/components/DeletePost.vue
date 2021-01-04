<template>
  <div class="delete-post">
    <transition name="fade">
      <div class="modal" v-if="isModalVisible" @click="toggleModal">
        <div class="modal-content" @click.stop>
          <div @click="toggleModal" class="close">
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
          </div>
          <h3>Do you really want to delete this post?</h3>
          <ul class="buttons">
            <li>
              <button class="button button--gray" @click="toggleModal">
                No
              </button>
            </li>
            <li>
              <button class="button" @click="deletePost(postId)">
                Yes
              </button>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <a title="Delete post" @click="toggleModal">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#000">
        <path
          fill-rule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          clip-rule="evenodd"
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
    postId: String
  },
  setup() {
    const isModalVisible = ref(false)
    const store = useStore()

    function toggleModal() {
      isModalVisible.value = !isModalVisible.value
    }

    function deletePost(postId) {
      store.dispatch('deletePost', postId)
    }

    return {
      isModalVisible,
      toggleModal,
      deletePost
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.delete-post {
  position: relative;
  width: 20px;
  height: 20px;
  top: 5px;

  svg {
    fill: $error;
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
    max-width: 400px;
    background: #fff;
    padding: 40px;
    border-radius: 5px;
    box-shadow: 0 0 5px 0 rgba(#333, 0.5);
    z-index: 999;
  }

  h3 {
    margin-bottom: 30px;
  }

  .buttons {
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
    justify-content: space-between;
  }
}
</style>
