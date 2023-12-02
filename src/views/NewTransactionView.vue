<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import ProfileImage from '@/components/media/ProfileImage.vue';
import DropdownMenu from '@/components/dropdowns/DropdownMenu.vue';
import DropdownButton from '@/components/dropdowns/DropdownButton.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import { ref } from 'vue';

const isDropdownOpen = ref(false);
function toggleDropdown() {
    isDropdownOpen.value = !isDropdownOpen.value;
}
</script>

<template>
    <MainLayout>
        <!--Profile-->
        <div class="flex flex-col items-center lg:flex-row gap-5 mt-2 ml-10">
            <div class="flex flex-col items-center m-16">
                <RoundButton title="Mitgliederliste anzeigen">
                    <i class="fa-solid fa-plus"></i>
                </RoundButton>
            </div>
            <div class="flex flex-col items-center lg:items-start">
                <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Max Mustermann</h1>
                <span class="text-md text-gray-500">@maxmustermann</span>
            </div>

        </div>
        <div class="flex flex-col mt-5 ml-10">
            <span class="text-2xl font-bold text-gray-800 mb-5">hat bezahlt für...</span>
        </div>

        <!--list of person-->
        <div
            class="w-fit flex flex-wrap lg:items-start lg:flex-row justify-center bg-slate-100 mt-3 rounded-lg ml-10 relative">
            <div class="flex flex-col items-center m-10">
                <ProfileImage class="max-w-xs w-20 h-20 rounded-full" />
                <span class="text-md text-gray-700 font-bold mt-3">Person1</span>
            </div>
            <div class="flex flex-col items-center m-10">
                <ProfileImage class="max-w-xs w-20 h-20 rounded-full" />
                <span class="text-md text-gray-700 font-bold mt-3">Person2</span>
            </div>

            <!--Add button 1-->
            <div class="flex flex-col items-center m-16 relative">
                <RoundButton title="Mitgliederliste anzeigen" @click="toggleDropdown">
                    <i class="fa-solid fa-plus"></i>
                    
                    <!-- Dropdown -->
                    <div v-show="isDropdownOpen" class="bg-white absolute left-16 shadow-sm">
                        <p>
                            <DropdownButton>
                                <div class="lg:flex justify-center">
                                    <ProfileImage class="max-w-xs w-10 h-10 rounded-full" />
                                    <span class="text-md text-gray-700 font-bold mt-3 ml-3">Person1</span>
                                </div>
                            </DropdownButton>
                            <DropdownButton>
                                <div class="lg:flex justify-center">
                                    <ProfileImage class="max-w-xs w-10 h-10 rounded-full" />
                                    <span class="text-md text-gray-700 font-bold mt-3 ml-3">Person2</span>
                                </div>
                            </DropdownButton>
                        </p>
                    </div>
                </RoundButton>
            </div>

            <!--？？？-->
            <DropdownMenu>
                <template #trigger>
                        <RoundButton title="Mitgliederliste anzeigen" class="flex flex-col items-center m-16">
                            <i class="fa-solid fa-plus"></i>
                        </RoundButton>
                </template>
                <DropdownButton>
                    <div class="lg:flex justify-center">
                        <ProfileImage class="max-w-xs w-10 h-10 rounded-full" />
                        <span class="text-md text-gray-700 font-bold mt-3 ml-3">Person1</span>
                    </div>
                </DropdownButton>
                <DropdownButton>
                    <div class="lg:flex justify-center">
                        <ProfileImage class="max-w-xs w-10 h-10 rounded-full" />
                        <span class="text-md text-gray-700 font-bold mt-3 ml-3">Person2</span>
                    </div>
                </DropdownButton>
            </DropdownMenu>

        </div>


    </MainLayout>
</template>  