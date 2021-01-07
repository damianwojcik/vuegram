<template>
  <div class="profile">
    <div class="text-center">
      <img
        class="profile__avatar"
        :alt="`${user.name} photo`"
        :src="
          user.photo
            ? user.photo
            : require(`../assets/images/avatar-placeholder.jpg`)
        "
      />
    </div>
    <h5>{{ user.name }}</h5>
    <h4 v-if="user.username">({{ user.username }})</h4>
    <p v-if="user.title">{{ user.title }}</p>
    <span v-if="user.hometown">{{ user.hometown }}</span>
    <a :href="'mailto: ' + user.email">{{ user.email }}</a>
  </div>
</template>

<script>
export default {
  props: {
    user: Object
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.profile {
  &__avatar {
    display: inline-block;
    margin-bottom: 20px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }

  h4 {
    font-size: 0.8rem;
  }

  p {
    color: $medium;
  }

  span {
    font-size: 15px;
    color: $secondary-text;
    display: block;
    margin-bottom: 10px;
  }
}
</style>
