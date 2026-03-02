<template>
  <div
    class="flex flex-col items-center lg:items-start lg:flex-row justify-between w-full lg:max-w-[80%] gap-2 p-5 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-lg animate-pulse"
  >
    <div class="flex flex-col lg:flex-row items-center lg:items-start">
      <!-- Avatar placeholder -->
      <div class="flex-shrink-0">
        <div class="rounded-full w-16 h-16 lg:w-32 lg:h-32 bg-gray-300 dark:bg-gray-600"></div>
      </div>

      <div class="lg:ml-5 flex flex-col gap-2 w-full">
        <div class="flex flex-col gap-1">
          <!-- Room name placeholder -->
          <div class="h-7 bg-gray-300 dark:bg-gray-600 rounded w-40 mx-auto lg:mx-0"></div>
          <!-- Topic placeholder -->
          <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mx-auto lg:mx-0"></div>
        </div>

        <div class="flex flex-col gap-2 items-center lg:items-start">
          <!-- Members placeholder -->
          <div class="h-5 bg-gray-300 dark:bg-gray-600 rounded w-28"></div>
          <!-- Balance placeholder -->
          <div class="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
        </div>
      </div>
    </div>

    <!-- Action buttons placeholder -->
    <div class="flex flex-row self-center gap-2">
      <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
    </div>
  </div>
</template>
