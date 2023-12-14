<script setup lang="ts">
/**
 * @component {NewTransactionView} - Component for creating a new transaction in a Matrix room.
 * @author Yinlei Ba
 */
import MainLayout from '@/layouts/MainLayout.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import StandardButton from '@/components/buttons/StandardButton.vue';
import User from '@/logic/models/User';
import {ref, watch} from 'vue';
import TransactionEvent from '@/logic/models/events/custom/TransactionEvent';
import {useRoute} from 'vue-router';
import UserAvatar from '@/components/media/UserAvatar.vue';
import useGlobalEventBus from '@/composables/useGlobalEventBus';
import MemberDropdown from '@/views/partials/MemberDropdown.vue';
import DebtorTile from '@/views/partials/DebtorTile.vue';
import SystemAlert from '@/components/messaging/SystemAlert.vue';
import {useRoomsStore} from '@/stores/rooms';
import {useLoggedInUserStore} from '@/stores/loggedInUser';
import MatrixEvent from '@/logic/models/events/MatrixEvent';
import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';
import router from '@/router';
import type {Ref} from 'vue';

const roomId = useRoute().params.roomId.toString();

const {bus} = useGlobalEventBus();

const roomsStore = useRoomsStore();
const loggedInUserStore = useLoggedInUserStore();

const room = roomsStore.getRoom(roomId);
const members = room?.getMembers();

const creditorId = ref(loggedInUserStore.user.getUserId());
const sum = ref('');
const purpose = ref('');
const debtors: Ref<User[]> = ref([]);

const isCreditorSelected = ref(true);
const isDropdownOpen1 = ref(false);
const isDropdownOpen2 = ref(false);

const loading = ref(false);
const errorPurpose = ref('');
const errorSum = ref('');
const showError = ref(false);

/**
 * Toggle the visibility of the first dropdown.
 */
function toggleDropdown1() {
  isDropdownOpen1.value = !isDropdownOpen1.value;
}
/**
 * Toggle the visibility of the second dropdown.
 */
function toggleDropdown2() {
  isDropdownOpen2.value = !isDropdownOpen2.value;
}

/**
 * Clear the selected creditor.
 */
function deleteCreditor() {
  creditorId.value = '';
  isCreditorSelected.value = false;
}

/**
 * Create a new transaction event with the provided information.
 */
async function createTransaction() {
  loading.value = true;
  if (
    creditorId.value !== '' &&
    debtors.value.length > 0 &&
    parseFloat(sum.value) !== 0 &&
    sum.value !== ''
  ) {
    const sumValue = parseFloat(sum.value);
    const debtorsJson = debtors.value.map((debtor) => ({
      userId: debtor.getUserId(),
      amount: sumValue / debtors.value.length,
    }));

    if (!purpose.value || purpose.value == '') {
      errorPurpose.value = 'Zweck ist ein Pflichtfeld!';
    } else {
      errorPurpose.value = '';
    }
    if (!validateSum()) {
      errorSum.value = 'Ungültige Summe!';
    } else {
      errorSum.value = '';
    }
    if (errorPurpose.value !== '' || errorSum.value !== '') {
      loading.value = false;
      return;
    }

    try {
      const transactionEvent = new TransactionEvent(
        MatrixEvent.EVENT_ID_NEW,
        roomId,
        purpose.value,
        sumValue,
        creditorId.value,
        debtorsJson
      );

      await transactionEvent.publish();
      router.push({name: 'transactions', params: {roomId: roomId}});

      showError.value = false;
    } catch (err) {
      console.log(err);
      showError.value = true;
    }
  } else {
    showError.value = true;
  }
}

/**
 * Add a new debtor to the list.
 *
 * @param {string} id - The userId of the debtor to add.
 * @return {void}
 */
function addNewDebtor(id: string): void {
  if (!members) {
    return;
  }

  const userToAdd = members[id];

  if (userToAdd) {
    debtors.value.push(userToAdd);
  }
}

/**
 * Remove a debtor from the list.
 *
 * @param {string} id - The user ID of the debtor to remove.
 * @return {void}
 */
function deleteDebtor(id: string): void {
  const index = debtors.value.findIndex((member) => member.getUserId() === id);
  if (index !== -1) {
    debtors.value.splice(index, 1);
  }
}

/**
 * Select a creditor from the members.
 *
 * @param {string} id - The userId of the selected creditor.
 * @return {void}
 */
function selectCreditor(id: string): void {
  creditorId.value = id;
  isCreditorSelected.value = true;
}

/**
 * Validate the input for the sum field.
 *
 * @return {boolean} - true if input correct
 */
function validateSum(): boolean {
  const currencyRegex = /^\d+(\.\d{0,2})?$/;
  return currencyRegex.test(sum.value);
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
    <div class="px-2 lg:px-10">
      <!--error message-->
      <SystemAlert v-if="showError" severity="danger" class="mt-5 flex flex-row items-center gap-2">
        <i class="fa-solid fa-circle-exclamation"></i>
        <p>Bitte vervollständigen Sie die Angaben</p>
      </SystemAlert>

      <!--Profile of creditor-->
      <div class="flex flex-col items-center lg:flex-row mt-2">
        <div class="flex flex-col items-center m-8">
          <!--creditor not selected-->
          <!--Add button-->
          <RoundButton
            v-if="!isCreditorSelected"
            title="Mitgliederliste anzeigen"
            class="relative"
            @click="toggleDropdown1"
          >
            <i class="fa-solid fa-plus"></i>
            <!-- Dropdown1 -->
            <div
              v-show="isDropdownOpen1"
              class="bg-white absolute left-16 z-10 border-2 border-slate-200 rounded"
            >
              <div
                v-for="member in members"
                :key="member.getUserId()"
                class="flex flex-col items-center m-10"
                @click="selectCreditor(member.getUserId())"
              >
                <MemberDropdown :member="member" />
              </div>
            </div>
          </RoundButton>
          <!--creditor selected-->
          <div
            v-if="members && isCreditorSelected"
            class="flex flex-col lg:flex-row items-center lg:items-start"
          >
            <div class="relative group transition duration-200 hover:scale-110">
              <!--'x'-->
              <div
                class="absolute inset-0 flex items-center bg-gray-800 rounded-full transition-all-300 justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
                @click="deleteCreditor"
              >
                <i class="text-white fa-solid fa-trash text-2xl"></i>
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
      <div class="flex flex-col items-center lg:flex-row">
        <span class="text-2xl font-bold text-gray-800 mb-5">hat bezahlt für...</span>
      </div>

      <!--list of debtors-->
      <div
        class="w-fit flex flex-wrap lg:items-start lg:flex-row justify-center bg-slate-100 mt-3 rounded-lg"
      >
        <div
          v-for="debtor in debtors"
          :key="debtor.getUserId()"
          class="flex flex-col items-center m-10"
        >
          <DebtorTile :debtor="debtor" @click="deleteDebtor(debtor.getUserId())" />
        </div>

        <div
          v-if="members && debtors.length < Object.keys(members).length"
          class="flex flex-col items-center m-16 relative"
        >
          <!--Add button-->
          <RoundButton title="Mitgliederliste anzeigen" class="relative" @click="toggleDropdown2">
            <i class="fa-solid fa-plus"></i>
            <!-- Dropdown2 -->
            <div
              v-show="isDropdownOpen2"
              class="bg-white absolute left-16 z-10 border-2 border-slate-200 rounded"
            >
              <div
                v-for="member in members"
                :key="member.getUserId()"
                class="flex flex-col items-center m-10"
                @click="addNewDebtor(member.getUserId())"
              >
                <MemberDropdown :member="member" />
              </div>
            </div>
          </RoundButton>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center gap-5 lg:flex-row mt-24">
        <!--entry widgets sum-->
        <InputFieldWithLabelAndError
          v-model="sum"
          :error="errorSum"
          class="w-full lg:w-1/4"
          type="number"
          :min="0"
          :step="0.01"
          label="Betrag in Euro"
        />
        <!--entry widgets purpose-->
        <InputFieldWithLabelAndError
          v-model="purpose"
          :error="errorPurpose"
          class="w-full"
          type="text"
          label="Zweck"
        />
      </div>
      <!--validate and create new transaction-->
      <div class="hidden lg:flex justify-end mt-5">
        <RoundButton title="Bestätigen" @click="createTransaction">
          <i class="fa-solid fa-check"></i>
        </RoundButton>
      </div>
      <StandardButton class="block lg:hidden mt-5" title="Bestätigen" @click="createTransaction">
        <i class="fa-solid fa-check"></i>
      </StandardButton>
    </div>
  </MainLayout>
</template>
