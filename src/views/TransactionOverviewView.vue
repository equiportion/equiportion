<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import ProfileImage from '@/components/media/ProfileImage.vue';
import TransactionTile from '@/views/partials/TransactionTile.vue';
import NewTransactionButton from '@/components/buttons/NewTransactionButton.vue'
</script>

<template>
    <MainLayout>
        <div class="flex flex-col px-5 mt-4 items-center">
            <div class="flex w-1/6"></div>
            <div class="flex flex-col w-4/6">
                <!--Profile image and username -->
                <div class="flex h-40 flex-col items-center lg:flex-row border-4 border-gray-400">
                    <ProfileImage class="w-32 h-32 rounded-full ml-4" />
                    <div class="flex flex-col items-center lg:items-start ml-4 gap-5">
                        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">PSE</h1>
                        <span> Max Muster, Maxi Muster, Maximilian Muster, ...</span>
                    </div>
                </div>
                <div class="flex flex-col border-r-4 border-l-4 border-b-4 border-gray-400">

                    <!--1 Transaction Tile-->
                    <TransactionTile></TransactionTile>
                    <TransactionTile></TransactionTile>
                    <TransactionTile></TransactionTile>

                    <!--Plus button-->
                    <NewTransactionButton ></NewTransactionButton>
                </div>
            </div>
            <div class="flex w-1/6"></div>    
        </div>
    </MainLayout>
</template>