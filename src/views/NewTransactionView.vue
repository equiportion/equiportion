<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import User from '@/logic/models/User';
import {ref} from 'vue';
import useAuthenticatedMatrixClient from '@/composables/useAuthenticatedMatrixClient';
import type AuthenticatedMatrixClient from '@/logic/models/clients/AuthenticatedMatrixClient';
import TransactionEvent from '@/logic/models/events/TransactionEvent';
import {useRoute} from 'vue-router';
import UserAvatar from '@/components/media/UserAvatar.vue';

const roomId = useRoute().params.roomId.toString();
const error = ref();
let creditorId = '';
const sum = ref<number>(0);
const purpose = ref('');
var client: AuthenticatedMatrixClient;

const debtors = ref<User[]>([]);
const members: {[userId: string]: User} = {};

useAuthenticatedMatrixClient(loadData);

const isCreditorSelected = ref(false);
const isDropdownOpen1 = ref(false);
const isDropdownOpen2 = ref(false);

function loadData(clientInstance: AuthenticatedMatrixClient) {
  client = clientInstance;
  const room = client.getRoom(roomId);
  const memberIds = room.getMemberIds();
  for (const memberId of memberIds) {
    members[memberId] = client.getUser(memberId);
    console.log(memberId);
    console.log(Object.keys(members).length);
  }
}

function toggleDropdown1() {
  console.log(members['@psetest:matrix.org'].getUserId());
  isDropdownOpen1.value = !isDropdownOpen1.value;
}
function toggleDropdown2() {
  isDropdownOpen2.value = !isDropdownOpen2.value;
}

function deleteCreditor() {
  creditorId = '';
  isCreditorSelected.value = false;
}

function createTransaction() {
  const debtorArray = debtors.value.map((debtor) => ({
    user: debtor.getUserId(),
    amount: sum.value / debtors.value.length,
  }));
  try {
    const transactionEvent = new TransactionEvent(
      roomId,
      purpose.value,
      sum.value,
      creditorId,
      debtorArray
    );
    client.publishEvent(transactionEvent);
  } catch (err) {
    error.value = err;
  }
}

function addNewMember(id: string) {
  const userToAdd = members[id];

  if (userToAdd) {
    debtors.value.push(userToAdd);
  }
}
function deleteMember(id: string) {
  const index = debtors.value.findIndex((member) => member.getUserId() === id);
  if (index !== -1) {
    debtors.value.splice(index, 1);
  }
}
function selectCreditor(id: string) {
  creditorId = id;
  isCreditorSelected.value = true;
}
</script>

<template>
  <MainLayout>
    <!--Profile of creditor-->
    <div class="flex flex-col items-center lg:flex-row mt-2 ml-10">
      <div class="flex flex-col items-center m-8">
        <!--creditor not selected-->
        <!--Add button-->
        <RoundButton
          v-if="!isCreditorSelected"
          title="Mitgliederliste anzeigen"
          @click="toggleDropdown1"
        >
          <i class="fa-solid fa-plus"></i>
          <!-- Dropdown1 -->
          <div v-show="isDropdownOpen1" class="bg-white absolute left-40 z-10 shadow-sm">
            <div
              v-for="member in members"
              :key="member.getUserId()"
              class="flex flex-col items-center m-10"
              @click="selectCreditor(member.getUserId())"
            >
              <!--<img :src="member.getAvatarUrl()" alt="Avatar" class="w-10 h-10 rounded-full" />-->
              <UserAvatar :user="member" class="w-10 h-10 rounded-full" />
              <span class="text-md text-gray-700 font-bold mt-3">{{
                member.getDisplayname()
              }}</span>
            </div>
          </div>
        </RoundButton>

        <!--creditor selected-->
        <div v-if="isCreditorSelected" class="flex flex-row items-center lg:items-start">
          <UserAvatar
            :user="members[creditorId]"
            class="w-20 h-20 rounded-full transition duration-200 hover:scale-110 hover:brightness-50"
            @click="deleteCreditor"
          />
          <div class="flex-col ml-8">
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
              {{ members[creditorId].getDisplayname() }}
            </h1>
            <span class="text-md text-gray-500">
              {{ members[creditorId].getUserId() }}
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
      class="w-fit flex flex-wrap lg:items-start lg:flex-row justify-center bg-slate-100 mt-3 rounded-lg ml-10 relative"
    >
      <div
        v-for="debtor in debtors"
        :key="debtor.getUserId()"
        class="flex flex-col items-center m-10"
      >
        <UserAvatar
          :user="members[debtor.getUserId()]"
          class="w-20 h-20 rounded-full transition duration-200 hover:scale-110 hover:brightness-50"
          @click="deleteMember(debtor.getUserId())"
        />
        <span class="text-md text-gray-700 font-bold mt-3">{{ debtor.getDisplayname() }}</span>
      </div>

      <div
        v-if="debtors.length < Object.keys(members).length"
        class="flex flex-col items-center m-16 relative"
      >
        <!--Add button-->
        <RoundButton title="Mitgliederliste anzeigen" @click="toggleDropdown2">
          <i class="fa-solid fa-plus"></i>
          <!-- Dropdown2 -->
          <div v-show="isDropdownOpen2" class="bg-white absolute left-16 shadow-sm">
            <div
              v-for="member in members"
              :key="member.getUserId()"
              class="flex flex-col items-center m-10"
              @click="addNewMember(member.getUserId())"
            >
              <template v-if="!debtors.some((debtor) => debtor.getUserId() === member.getUserId())">
                <UserAvatar :user="member" class="w-10 h-10 rounded-full" />
                <span class="text-md text-gray-700 font-bold mt-3">{{
                  member.getDisplayname()
                }}</span>
              </template>
            </div>
          </div>
        </RoundButton>
      </div>
    </div>

    <div class="flex flex-wrap justify-center items-center mt-24">
      <!--entry widgets sum-->
      <div>sum :</div>
      <div>
        <input
          v-model="sum"
          type="number"
          class="block p-3 bg-slate-100 sm:text-md rounded-md m-3"
        />
      </div>
      <i class="fa-solid fa-euro-sign"></i>
      <!--entry widgets purpose-->
      <div class="ml-28">purpose :</div>
      <div>
        <input
          v-model="purpose"
          type="text"
          class="block p-3 bg-slate-100 sm:text-md rounded-md m-3"
        />
      </div>
    </div>

    <!--validate and create new transaction-->
    <div class="flex justify-end m-10">
      <RoundButton title="Bestätigen" @click="createTransaction">
        <i class="fa-solid fa-check"></i>
      </RoundButton>
    </div>
  </MainLayout>
</template>
