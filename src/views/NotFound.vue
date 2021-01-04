<template>
  <div class="container notFound">
    <div class="col-1">
      <div class="text-center">
        <h1>404</h1>
        <h2>The page you are looking for does not exists.</h2>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.notFound {
  background: $white;
  display: flex;

  h1 {
    margin-bottom: 30px;
  }
}
</style>
