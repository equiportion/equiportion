<template>
  <Transition name="fade-height">
    <slot></slot>
  </Transition>
</template>
<style scoped>
.fade-height-enter-active,
.fade-height-leave-active {
  max-height: 1000px;
  opacity: 1;
  transition-property: opacity, max-height;
  transition-duration: 0.5s;
  transition-timing-function: ease;
}

.fade-height-enter-from,
.fade-height-leave-to {
  max-height: 0px;
  opacity: 0;
}
</style>
