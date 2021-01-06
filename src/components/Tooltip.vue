<template>
  <div class="tooltip">{{ msg }}</div>
</template>

<script>
export default {
  props: {
    msg: String
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.tooltip {
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  position: absolute;
  top: calc(100% + 20px);
  left: 50%;
  margin: 0 auto;
  transform: translate(-50%, -50%);
  color: rgb(28, 30, 33);
  font-size: 12px;
  background: $tooltip-bg;
  color: $white;
  border-radius: 4px;
  min-width: 80px;
  text-align: center;
  white-space: nowrap;
  padding: 10px;
  z-index: 9;
  word-break: break-word;
}
</style>
