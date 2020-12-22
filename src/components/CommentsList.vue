<template>
  <div class="comments">
    <div v-for="comment in postComments" :key="comment.id" class="comment">
      <p>{{ comment.userName }}</p>
      <span>{{ formatDate(comment.createdOn) }}</span>
      <p>{{ comment.content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    postComments: Object,
    formatDate: Function
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.comment {
  font-size: 14px;
  padding: 1.5rem;
  border-top: 1px solid #e6ecf0;

  &:first-of-type {
    border-top: 0;
  }

  h5 {
    margin: 0 0 0.5rem;
  }

  span {
    display: block;
    font-style: italic;
    font-size: 12px;
    margin-bottom: 0.5rem;
    color: darken($light, 20%);
  }

  p {
    margin: 0;
  }
}
</style>
