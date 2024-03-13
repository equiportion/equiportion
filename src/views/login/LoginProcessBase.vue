<script setup lang="ts">
import LogoSquare from '@/components/brand/LogoSquare.vue';
import LogoSquareWhite from '@/components/brand/LogoSquareWhite.vue';

const headingText = 'Willkommen bei EquiPortion!';
const descriptionText =
  'Aufteilen von Rechnungen war noch nie so einfach. Mit EquiPortion kannst du deine Rechnungen aufteilen und mit deinen Freunden teilen. Einfach, schnell und sicher über den Matrix-Server deines Vertrauens.';
</script>
<template>
  <section class="bg-white dark:bg-gray-800">
    <div class="lg:grid lg:min-h-screen lg:grid-cols-12">
      <section
        class="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6"
      >
        <img
          alt="Person holding money"
          src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          class="absolute inset-0 h-full w-full object-cover opacity-80"
        />

        <div class="hidden lg:relative lg:block lg:p-12">
          <a class="block text-white" href="/">
            <LogoSquareWhite class="h-8 sm:h-10" />
          </a>

          <h2 class="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            {{ headingText }}
          </h2>

          <p class="mt-4 leading-relaxed text-white/90">
            {{ descriptionText }}
          </p>
        </div>
      </section>

      <main
        class="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
      >
        <div class="max-w-xl lg:max-w-3xl w-full">
          <div class="relative -mt-16 block lg:hidden">
            <a
              class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600 sm:h-20 sm:w-20"
              href="/"
            >
              <LogoSquare />
            </a>

            <h1
              class="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-4xl"
            >
              {{ headingText }}
            </h1>

            <p class="mt-4 leading-relaxed text-gray-500 dark:text-gray-300">
              {{ descriptionText }}
            </p>
          </div>

          <slot />
        </div>
      </main>
    </div>
  </section>
</template>
