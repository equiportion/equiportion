<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import ProfileImage from '@/components/media/ProfileImage.vue';
</script>

<template>
    <MainLayout>
        <div class="flex flex-col px-5 mt-4 items-center">

            <!--Profile image and username -->
            <div class="flex w-full">
                <div class="flex w-1/6"></div>
                <div class="flex w-4/6 h-40 flex-col items-center lg:flex-row border-4 border-gray-400">
                    <ProfileImage class="w-32 h-32 rounded-full ml-4" />
                    <div class="flex flex-col items-center lg:items-start ml-4 gap-5">
                        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">PSE</h1>
                        <span class=""> Max Muster, Maxi Muster, Maximilian Muster, ...</span>
                    </div>
                </div>
                <div class="flex w-1/6"></div>
            </div>
            
            <!--List of Transaction Tiles-->
            <div class="flex w-full">
                <div class="flex w-1/6">
                </div>
                <div class="flex flex-col w-4/6 border-r-4 border-l-4 border-b-4 border-gray-400">

                    <!--1 Transaction Tile-->
                    <div class="flex flex-row h-32 m-5 rounded-lg border-r-8 border-b-8 bg-gray-100 border-gray-200">
                        <div class="flex flex-col w-1/4 h-32 items-center justify-center">PSE</div>
                        <div class="flex flex-col w-1/4 h-32 items-center justify-center">50€</div>
                        <div class="flex flex-col w-1/4 h-32 items-center justify-center">Max M.</div>
                        <div class="flex flex-col w-1/4 h-32 items-center justify-center">01.01.2023</div>
                    </div>

                    <div class="flex flex-row h-32 m-5 rounded-lg border-r-8 border-b-8 bg-gray-100 border-gray-200">
                    </div>
                    <div class="flex flex-row h-32 m-5 rounded-lg border-r-8 border-b-8 bg-gray-100 border-gray-200">
                    </div>

                    <!--Plus button-->
                    <div class="flex flex-row h-24 justify-end items-center m-5">
                        <div class="flex rounded-full h-24 w-24 items-center justify-center bg-green-300 border-2 border-green-400">
                            <i class="fa-solid fa-plus"></i>
                        </div>
                    </div>
                </div>
                <div class="flex w-1/6">
                </div>
            </div>
        </div>
    </MainLayout>
</template>