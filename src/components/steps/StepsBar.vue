<script setup lang="ts"></script>
<template>
  <div>
    <div
      class="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100"
    >
      <ol class="relative z-10 flex justify-between text-sm font-medium text-gray-500">
        <slot />
      </ol>
    </div>
  </div>
</template>
