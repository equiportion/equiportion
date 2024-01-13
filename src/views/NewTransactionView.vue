<script setup lang="ts">
/** Imports */
// Layout and Components
import MainLayout from '@/layouts/MainLayout.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import MoneyInputWrapper from '@/components/input/MoneyInputWrapper.vue';
import HugeFreeInput from '@/components/input/HugeFreeInput.vue';
import UserDropdown from '@/components/user/UserDropdown.vue';
import UserTile from '@/components/user/UserTile.vue';
import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';

// models
import Room from '@/logic/models/Room';
import User from '@/logic/models/User';

// stores
import {useRoomsStore} from '@/stores/rooms';
import {useLoggedInUserStore} from '@/stores/loggedInUser';

// utils
import waitForInitialSync from '@/logic/utils/waitForSync';

// framework and libraries
import {computed, ref, watch, type Ref} from 'vue';
import {useRoute} from 'vue-router';

/** Data */
const moneyVal = ref(0);
const reasonVal = ref('');
const creditorVal: Ref<User | undefined> = ref(undefined);

// get room id from url parameter
const roomId = ref(useRoute().params.roomId.toString());

// prepare room store and ref for room
const roomsStore = useRoomsStore();
const room: Ref<Room | undefined> = ref(undefined);

// logged in user
const loggedInUser = useLoggedInUserStore().user;

// load room
function loadRoom() {
  room.value = roomsStore.getRoom(roomId.value);
}
waitForInitialSync().then(() => {
  loadRoom();

  creditorVal.value = room.value?.getMembers()[loggedInUser.getUserId()];
});

// update if room changes
watch(roomId, () => {
  loadRoom();
});

// all Schuldner
const debtors: Ref<{user: User; fixedAmount: number}[]> = ref([]);

// function to add a debtor when clicking on a user in the dropdown
function addDebtor(user: User) {
  debtors.value.push({user, fixedAmount: 0});
}

// function to remove a debtor when clicking on the x
function removeDebtor(user: User) {
  debtors.value = debtors.value.filter((debtor) => debtor.user.getUserId() !== user.getUserId());
}

// all users to be shown in the add creditor dropdown
const selectableCreditorsList = computed(() => {
  if (!room.value) {
    return [];
  }

  const users: User[] = [];
  Object.values(room.value.getMembers()).forEach((user) => {
    users.push(user);
  });

  return users;
});

// adds the creditor
function addCreditor(user: User) {
  creditorVal.value = user;
}

// removes the creditor
function removeCreditor() {
  creditorVal.value = undefined;
}

// all users to be shown in the add user dropdown
const selectableUsersList = computed(() => {
  if (!room.value) {
    return [];
  }

  const users: User[] = [];
  Object.values(room.value.getMembers()).forEach((user) => {
    // if not in debtors, add to returned list
    if (!debtors.value.find((debtor) => debtor.user.getUserId() === user.getUserId())) {
      users.push(user);
    }
  });

  return users;
});

const restSum = computed(() => {
  let sumSingle = 0;
  debtors.value.forEach((debtor) => {
    sumSingle += debtor.fixedAmount;
  });
  return moneyVal.value - sumSingle;
});

const restValue = computed(() => {
  return Math.floor(restSum.value / debtors.value.length);
});

const sumSingle = computed(() => {
  const sumSingle: {[key: string]: number} = {};
  debtors.value.forEach((debtor) => {
    sumSingle[debtor.user.getUserId()] = debtor.fixedAmount + restValue.value;
  });
  return sumSingle;
});

/** Validation */

const fixedAmountError = computed(() => {
  if (restSum.value < 0) {
    return 'Die Summe der festen Beträge darf nicht größer als der Gesamtbetrag sein';
  }

  return undefined;
});

const sumError = computed(() => {
  if (moneyVal.value >= 999999999999999) {
    return 'Der Gesamtbetrag darf nicht größer als 999.999.999.999.999 € sein';
  }

  return undefined;
});

// when all fields are valid, the submit button is enabled
const submitDisabled = computed(() => {
  if (
    fixedAmountError.value ||
    debtors.value.length === 0 ||
    !creditorVal.value ||
    !moneyVal.value ||
    !reasonVal.value
  ) {
    return true;
  }
  return false;
});

/**
 * Generic Functions
 */
function eurosPart(num: number): string {
  return Math.floor(num / 100).toString();
}

function centsPart(num: number): string {
  return ('00' + (num % 100)).slice(-2);
}
</script>

<template>
  <MainLayout>
    <!-- Submit Button (bottom right) -->
    <RoundButton
      id="submitButton"
      class="fixed bottom-5 right-5 shadow-lg"
      :disabled="submitDisabled"
    >
      <i class="fa-solid fa-check"></i>
    </RoundButton>

    <!-- Form -->
    <div class="p-2 lg:p-5 flex flex-col gap-5">
      <!-- Creditor -->
      <div class="flex flex-col items-center">
        <div
          v-if="!creditorVal"
          class="bg-gray-100 p-5 rounded-lg border-gray-300 border-2 border-dashed shadow-lg"
        >
          <UserDropdown
            id="creditorUserDropdown"
            heading="Gläubiger*in hinzufügen"
            :users="selectableCreditorsList"
            @user-click="(user) => addCreditor(user)"
          >
            <template #trigger="{toggle}">
              <div class="flex flex-row items-center gap-2">
                <RoundButton
                  id="addCreditorButton"
                  class="shadow-lg"
                  title="Gläubiger*in hinzufügen"
                  :disabled="selectableCreditorsList.length == 0"
                  @click="toggle"
                >
                  <i class="fa-solid fa-user-plus"></i>
                </RoundButton>
                <span class="text-gray-600">Gläubiger*in</span>
              </div>
            </template>
          </UserDropdown>
        </div>
        <div v-else class="flex flex-col bg-gray-100 p-4 rounded-lg shadow-lg items-center gap-2">
          <div class="flex flex-row items-center gap-2">
            <i
              id="removeCreditor"
              class="fa-solid fa-times text-xl text-gray-500 cursor-pointer"
              @click="removeCreditor()"
            >
            </i>
            <UserTile :user="creditorVal" />
          </div>
          <span class="text-sm text-gray-500">Gläubiger*in</span>
        </div>
      </div>

      <!-- Sum -->
      <div class="flex flex-col items-center">
        <MoneyInputWrapper v-model="moneyVal">
          <template #input="{inputValue, updateValue}">
            <HugeFreeInput
              id="inputFieldSum"
              label="Gesamtbetrag (Euro)"
              placeholder="0,00"
              :model-value="inputValue"
              @update:model-value="(value: string) => updateValue(value)"
            />
          </template>
        </MoneyInputWrapper>
        <span v-if="sumError" class="text-sm text-red-500">
          {{ sumError }}
        </span>
      </div>

      <!-- Purpose -->
      <HugeFreeInput
        id="inputFieldPurpose"
        v-model="reasonVal"
        label="Zweck"
        placeholder="z.B. Einkauf"
      />

      <div class="flex flex-col mt-5 w-full items-center gap-5">
        <!-- Uneven splitting -->
        <div
          v-for="debtor in debtors"
          id="unevenSplitting"
          :key="debtor.user.getUserId()"
          class="flex flex-col lg:flex-row w-full lg:max-w-[80%] gap-4 bg-gray-100 p-4 rounded-lg shadow-lg"
        >
          <div class="flex flex-row gap-3 w-full lg:w-1/3 justify-between lg:justify-start">
            <UserTile :user="debtor.user" />
            <div
              class="flex flex-col lg:flex-row items-center text-center lg:order-first"
              @click="removeDebtor(debtor.user)"
            >
              <i class="fa-solid fa-times text-xl text-gray-500 cursor-pointer"></i>
            </div>
          </div>
          <MoneyInputWrapper v-model="debtor.fixedAmount">
            <template #input="{inputValue, updateValue}">
              <InputFieldWithLabelAndError
                type="text"
                class="flex-grow"
                label="Fester Betrag (Euro)"
                placeholder="0,00"
                :error="fixedAmountError"
                :model-value="inputValue"
                @update:model-value="(value: string) => updateValue(value)"
              />
            </template>
          </MoneyInputWrapper>
          <MoneyInputWrapper v-model="restValue">
            <template #input="{inputValue}">
              <InputFieldWithLabelAndError
                type="text"
                class="flex-grow"
                label="+ Rest (Euro)"
                :disabled="true"
                placeholder="0,00"
                :model-value="inputValue"
              />
            </template>
          </MoneyInputWrapper>
          <MoneyInputWrapper v-model="sumSingle[debtor.user.getUserId()]">
            <template #input="{inputValue}">
              <InputFieldWithLabelAndError
                type="text"
                class="flex-grow"
                label="= Summe (Euro)"
                :disabled="true"
                placeholder="0,00"
                :model-value="inputValue"
              />
            </template>
          </MoneyInputWrapper>
        </div>
        <span v-if="debtors.length == 0" id="noDebtorMessage" class="text-sm text-gray-400">
          Keine Schuldner*innen ausgewählt
        </span>

        <!-- Add Person for uneven splitting -->
        <UserDropdown
          id="debtorUserDropdown"
          heading="Schuldner*in hinzufügen"
          :users="selectableUsersList"
          @user-click="(user) => addDebtor(user)"
        >
          <template #trigger="{toggle}">
            <div class="flex flex-col items-center gap-1">
              <RoundButton
                id="addDebtorButton"
                class="shadow-lg"
                title="Schuldner*in hinzufügen"
                :disabled="selectableUsersList.length == 0"
                @click="toggle"
              >
                <i class="fa-solid fa-user-plus"></i>
              </RoundButton>
            </div>
          </template>
        </UserDropdown>

        <!-- Rest-->
        <div
          id="rest"
          class="flex flex-col bg-gray-100 w-full lg:max-w-[80%] p-4 rounded-lg shadow-lg"
        >
          <span class="text-xl">
            Rest: <strong>{{ eurosPart(restSum) }},{{ centsPart(restSum) }} €</strong>
          </span>
          <span class="text-sm text-gray-500">
            Wird gleichmäßig auf alle Schuldner*innen verteilt
          </span>
          <span v-if="fixedAmountError" class="text-sm text-red-500">
            {{ fixedAmountError }}
          </span>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
