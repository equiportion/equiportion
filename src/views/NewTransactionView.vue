<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import User from '@/logic/models/User';
import { ref } from 'vue';

let payerId = '';
const amount = ref(''); //betrag
const subject = ref(''); //betreff

const showMembers = ref<User[]>([
]);
const members = ref<User[]>([
    new User('person1id', 'Person 1', 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg'),
    new User('person2id', 'Person 2', 'https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg'),
    new User('person3id', 'Person 3', 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg'),
]);

const isPayerSelected = ref(false);
const isDropdownOpen1 = ref(false);
const isDropdownOpen2 = ref(false);


function toggleDropdown1() {
    isDropdownOpen1.value = !isDropdownOpen1.value;
}
function toggleDropdown2() {
    isDropdownOpen2.value = !isDropdownOpen2.value;
}

function deletePayer() {
    payerId = '';
    isPayerSelected.value = false;
}
function addNewMember(id: string) {
    const userToAdd = members.value.find(member => member.getUserId() === id);

    if (userToAdd) {
        showMembers.value.push(userToAdd);
    }
}
function deleteMember(id: string) {
    const index = showMembers.value.findIndex(member => member.getUserId() === id);

    if (index !== -1) {
        showMembers.value.splice(index, 1);
    }
}
function selectPayer(id: string) {
    payerId = id;
    isPayerSelected.value = true;
}


</script>

<template>
    <MainLayout>
        <!--Profile of payer-->
        <div class="flex flex-col items-center lg:flex-row mt-2 ml-10">
            <div class="flex flex-col items-center m-8">
                <!--payer not selected-->
                <RoundButton v-if="!isPayerSelected" title="Mitgliederliste anzeigen" @click="toggleDropdown1">
                    <i class="fa-solid fa-plus"></i>
                    <!-- Dropdown1 -->
                    <div v-show="isDropdownOpen1" class="bg-white absolute left-40 z-10 shadow-sm">
                        <div v-for="member in members" :key="member.getUserId()" class="flex flex-col items-center m-10"
                            @click="selectPayer(member.getUserId())">
                            <img :src="members.find(x => x.getUserId() === member.getUserId())?.getAvatarUrl()" alt="Avatar"
                                class="w-10 h-10 rounded-full" />
                            <span class="text-md text-gray-700 font-bold mt-3">{{
                                member.getDisplayname() }}</span>
                        </div>
                    </div>
                </RoundButton>

                <!--payer selected-->
                <div v-if="isPayerSelected" class="flex flex-row items-center lg:items-start">
                    <img :src="members.find(x => x.getUserId() === payerId)?.getAvatarUrl()" alt="Avatar"
                        class="w-20 h-20 rounded-full transition duration-200  hover:scale-110 hover:brightness-50"
                        @click="deletePayer" />
                    <div class="flex-col ml-8">
                        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
                            {{ members.find(x => x.getUserId() === payerId)?.getDisplayname() }}
                        </h1>
                        <span class="text-md text-gray-500">
                            {{ '@' + members.find(x => x.getUserId() === payerId)?.getUserId() }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col ml-14">
            <span class="text-2xl font-bold text-gray-800 mb-5">hat bezahlt für...</span>
        </div>

        <!--list of member-->
        <div
            class="w-fit flex flex-wrap lg:items-start lg:flex-row justify-center bg-slate-100 mt-3 rounded-lg ml-10 relative">
            <div v-for="showMember in showMembers" :key="showMember.getUserId()" class="flex flex-col items-center m-10">
                <img :src="showMember.getAvatarUrl()" alt="Avatar"
                    class="w-20 h-20 rounded-full  transition duration-200  hover:scale-110 hover:brightness-50"
                    @click="deleteMember(showMember.getUserId())" />
                <span class="text-md text-gray-700 font-bold mt-3">{{ showMember.getDisplayname() }}</span>
            </div>

            <div v-if="showMembers.length < members.length" class="flex flex-col items-center m-16 relative">
                <!--Add button-->
                <RoundButton title="Mitgliederliste anzeigen" @click="toggleDropdown2">
                    <i class="fa-solid fa-plus"></i>
                    <!-- Dropdown2 -->
                    <div v-show="isDropdownOpen2" class="bg-white absolute left-16 shadow-sm">
                        <div v-for="member in members" :key="member.getUserId()" class="flex flex-col items-center m-10"
                            @click="addNewMember(member.getUserId())">
                            <template v-if="!showMembers.some(showMember => showMember.getUserId() === member.getUserId())">

                                <img :src="members.find(x => x.getUserId() === member.getUserId())?.getAvatarUrl()"
                                    alt="Avatar" class="w-10 h-10 rounded-full" />
                                <span class="text-md text-gray-700 font-bold mt-3">{{
                                    member.getDisplayname() }}</span>

                            </template>
                        </div>
                    </div>
                </RoundButton>
            </div>
        </div>


        <div class="flex flex-wrap justify-center items-center mt-24 ">
            <!--Eingabefeld Betrag-->
            <div>Betrag :</div>
            <div>
                <input v-model="amount" type="number" class="block p-3  bg-slate-100 sm:text-md rounded-md m-3">
            </div>
            <i class="fa-solid fa-euro-sign"></i>
            <!--Eingabefeld Betreff-->
            <div class="ml-28">Betreff :</div>
            <div>
                <input v-model="subject" type="text" class="block p-3  bg-slate-100 sm:text-md rounded-md m-3">
            </div>
        </div>

        <div class="flex justify-end m-10">
            <RoundButton title="Bestätigen">
                <i class="fa-solid fa-check"></i>
            </RoundButton>
        </div>



    </MainLayout>
</template>  