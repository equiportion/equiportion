<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import User from '@/logic/models/User';
import {ref, reactive, watch} from 'vue';
import useAuthenticatedMatrixClient from '@/composables/useAuthenticatedMatrixClient';
import type AuthenticatedMatrixClient from '@/logic/models/clients/AuthenticatedMatrixClient';
import TransactionEvent from '@/logic/models/events/TransactionEvent';
import {useRoute} from 'vue-router';
import UserAvatar from '@/components/media/UserAvatar.vue';
import useGlobalEventBus from '@/composables/useGlobalEventBus';
import MemberDropdown from '@/views/partials/MemberDropdown.vue';

const roomId = useRoute().params.roomId.toString();
const error = ref();
let creditorId = '';
const sum = ref('');
const purpose = ref('');
var client: AuthenticatedMatrixClient;

const debtors = ref<User[]>([]);
const members: {[userId: string]: User} = reactive({});

const isCreditorSelected = ref(false);
const isDropdownOpen1 = ref(false);
const isDropdownOpen2 = ref(false);
const showError = ref(false);

const {bus} = useGlobalEventBus();

useAuthenticatedMatrixClient(loadData);

function loadData(clientInstance: AuthenticatedMatrixClient) {
  client = clientInstance;
  const room = client.getRoom(roomId);
  const memberIds = room.getMemberIds();
  for (const memberId of memberIds) {
    members[memberId] = client.getUser(memberId);
  }
  creditorId = client.getLoggedInUser().getUserId();
  isCreditorSelected.value = true;
}

function toggleDropdown1() {
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
  if (creditorId && debtors.value.length > 0 && parseFloat(sum.value) !== 0 && sum.value !== '') {
    const debtorArray = debtors.value.map((debtor) => ({
      user: debtor.getUserId(),
      amount: parseInt(sum.value) / debtors.value.length,
    }));
    try {
      const transactionEvent = new TransactionEvent(
        roomId,
        purpose.value,
        parseInt(sum.value),
        creditorId,
        debtorArray
      );
      client.publishEvent(transactionEvent);
      showError.value = false;
    } catch (err) {
      error.value = err;
    }
  } else {
    showError.value = true;
  }
}

function addNewDebtor(id: string) {
  const userToAdd = members[id];

  if (userToAdd) {
    debtors.value.push(userToAdd);
  }
}
function deleteDebtor(id: string) {
  const index = debtors.value.findIndex((member) => member.getUserId() === id);
  if (index !== -1) {
    debtors.value.splice(index, 1);
  }
}
function selectCreditor(id: string) {
  creditorId = id;
  isCreditorSelected.value = true;
}
function validateSum() {
  const currencyRegex = /^\d+(\.\d{0,2})?$/;
  if (!currencyRegex.test(sum.value)) {
    const parsedValue = parseFloat(sum.value);

    if (!isNaN(parsedValue)) {
      sum.value = parsedValue.toFixed(2);
    } else {
      sum.value = '';
    }
  }
}

// close dropdown on click outside
watch(
  () => bus.value.get('click'),
  (val) => {
    if (!val[0]['no-close']) {
      isDropdownOpen1.value = false;
      isDropdownOpen2.value = false;
    }
  }
);
</script>

<template>
  <MainLayout>
    <!--error message-->
    <div
      v-if="showError"
      class="p-4 mb-4 text-yellow-800 flex flex-row items-center gap-2 border border-yellow-300 rounded-lg bg-yellow-50 ml-32 mr-32 mt-5"
    >
      <i class="fa-solid fa-circle-exclamation"></i>
      <div>Bitte vervollständigen Sie die Angaben</div>
    </div>

    <!--Profile of creditor-->
    <div class="flex flex-col items-center lg:flex-row mt-2 ml-10">
      <div class="flex flex-col items-center m-8">
        <!--creditor not selected-->
        <!--Add button-->
        <RoundButton
          v-if="!isCreditorSelected"
          title="Mitgliederliste anzeigen"
          @click="toggleDropdown1"
          class="relative"
        >
          <i class="fa-solid fa-plus"></i>
          <!-- Dropdown1 -->
          <MemberDropdown
            :isOpen="isDropdownOpen1"
            :members="members"
            :handleClick="selectCreditor"
          />
        </RoundButton>
        <!--creditor selected-->
        <div v-if="isCreditorSelected" class="flex flex-row items-center lg:items-start">
          <div class="relative group transition duration-200 hover:scale-110">
            <!--'x'-->
            <div
              class="absolute inset-0 flex items-center bg-gray-800 rounded-full transition-all-300 justify-center opacity-0 group-hover:opacity-100 transition duration-200"
              @click="deleteCreditor"
            >
              <i class="text-white fa-solid fa-xmark text-2xl"></i>
            </div>
            <UserAvatar
              :user="members[creditorId]"
              class="w-20 h-20 rounded-full transition duration-200 hover:scale-110 hover:brightness-50"
            />
          </div>

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
    <div class="flex flex-col items-center lg:flex-row ml-14">
      <span class="text-2xl font-bold text-gray-800 mb-5">hat bezahlt für...</span>
    </div>

    <!--list of debtors-->
    <div
      class="w-fit flex flex-wrap lg:items-start lg:flex-row justify-center bg-slate-100 mt-3 rounded-lg ml-10"
    >
      <div
        v-for="debtor in debtors"
        :key="debtor.getUserId()"
        class="flex flex-col items-center m-10"
      >
        <div class="relative group transition duration-200 hover:scale-110">
          <!--'x'-->
          <div
            class="absolute inset-0 flex items-center bg-gray-800 rounded-full transition-all-300 justify-center opacity-0 group-hover:opacity-100 transition duration-200"
            @click="deleteDebtor(debtor.getUserId())"
          >
            <i class="text-white fa-solid fa-xmark text-2xl"></i>
          </div>
          <UserAvatar :user="members[debtor.getUserId()]" class="w-20 h-20 rounded-full" />
        </div>
        <span class="text-md text-gray-700 font-bold mt-3">{{ debtor.getDisplayname() }}</span>
      </div>

      <div
        v-if="debtors.length < Object.keys(members).length"
        class="flex flex-col items-center m-16 relative"
      >
        <!--Add button-->
        <RoundButton title="Mitgliederliste anzeigen" @click="toggleDropdown2" class="relative">
          <i class="fa-solid fa-plus"></i>
          <!-- Dropdown2 -->
          <MemberDropdown
            :isOpen="isDropdownOpen2"
            :members="members"
            :handleClick="addNewDebtor"
          />
        </RoundButton>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center lg:gap-32 lg:flex-row mt-24">
      <!--entry widgets sum-->
      <div class="flex flex-row items-center">
        <div>Betrag :</div>
        <div>
          <input
            @input="validateSum"
            v-model="sum"
            type="text"
            class="block p-3 bg-slate-100 sm:text-md rounded-md m-3"
          />
        </div>
        <i class="fa-solid fa-euro-sign"></i>
      </div>
      <!--entry widgets purpose-->
      <div class="flex flex-row items-center">
        <div>Zweck :</div>
        <div>
          <input
            v-model="purpose"
            type="text"
            class="block p-3 bg-slate-100 sm:text-md rounded-md m-3"
          />
        </div>
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
