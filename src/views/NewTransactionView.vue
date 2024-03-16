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
import SystemAlert from '@/components/messaging/SystemAlert.vue';

// models
import Room from '@/logic/models/Room';
import User from '@/logic/models/User';
import TransactionEvent from '@/logic/models/events/custom/TransactionEvent';

// client
import AuthenticatedMatrixClient from '@/logic/clients/AuthenticatedMatrixClient';

// stores
import {useRoomsStore} from '@/stores/rooms';
import {useLoggedInUserStore} from '@/stores/loggedInUser';

// utils
import waitForInitialSync from '@/logic/utils/waitForSync';
import {absCentsPart, absEurosPart} from '@/logic/utils/money';

// receipt analysis
import ReceiptScanner from '@/logic/receiptanalysis/ReceiptScanner';

// framework and libraries
import {computed, ref, watch, type Ref} from 'vue';
import {useRoute} from 'vue-router';
import router from '@/router';

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

  creditorVal.value = room.value?.getMember(loggedInUser.getUserId());

  prefillFromSessionStorage();
});

// update if room changes
watch(roomId, () => {
  loadRoom();
});

// all debtors
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
  const restValue: {[key: string]: number} = {};
  debtors.value.forEach((debtor) => {
    restValue[debtor.user.getUserId()] = Math.floor(restSum.value / debtors.value.length);
  });

  let rest = restSum.value % debtors.value.length;
  let i = 0;
  while (rest > 0) {
    restValue[debtors.value[i].user.getUserId()] += 1;
    rest -= 1;
    i += 1;

    if (i >= debtors.value.length) {
      i = 0;
    }
  }

  return restValue;
});

const sumSingle = computed(() => {
  const sumSingle: {[key: string]: number} = {};
  debtors.value.forEach((debtor) => {
    sumSingle[debtor.user.getUserId()] =
      debtor.fixedAmount + restValue.value[debtor.user.getUserId()];
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
 * Submission
 */
const submitLoading = ref(false);
const submitError = ref('');

const debtorList = computed(() => {
  let returnValue: {userId: string; amount: number}[] = [];
  Object.keys(sumSingle.value).forEach((userId) => {
    returnValue.push({userId, amount: sumSingle.value[userId]});
  });
  return returnValue;
});

// function to submit the transaction
async function submit() {
  if (submitDisabled.value) {
    return;
  }

  submitLoading.value = true;

  let receiptUrl: string | undefined = undefined;
  if (selectedReceiptFile.value) {
    // upload receipt
    receiptUrl = await AuthenticatedMatrixClient.getClient().uploadFile(selectedReceiptFile.value);
    if (!receiptUrl) {
      submitError.value = 'Fehler beim Hochladen des Belegs';
      return;
    }
  }

  const newTransaction = TransactionEvent.newTransaction(
    room.value!,
    reasonVal.value,
    moneyVal.value,
    creditorVal.value!.getUserId(),
    debtorList.value,
    receiptUrl
  );

  try {
    await newTransaction.publish();
  } catch (e) {
    console.error(e);
    submitError.value = 'Fehler beim Erstellen der Transaktion: ' + e;
    submitLoading.value = false;
    return;
  }

  submitLoading.value = false;
  router.push({name: 'transactions', params: {roomId: roomId.value}});
}

//takes compensation and participating user from session storage and prefills transaction refs with it
function prefillFromSessionStorage() {
  if (!sessionStorage.getItem('compensation')) {
    return;
  }

  const compensation = parseInt(sessionStorage.getItem('compensation')!);
  sessionStorage.removeItem('compensation');
  const compensationUserId = sessionStorage.getItem('compensation_userId');
  sessionStorage.removeItem('compensation_userId');

  moneyVal.value = Math.abs(compensation);
  reasonVal.value = 'Ausgleichs-Transaktion';
  if (compensation > 0) {
    //creditor does not need to be set because the user is already set as creditor by default
    addDebtor(room.value?.getMember(compensationUserId!)!);
  } else {
    creditorVal.value = room.value?.getMember(compensationUserId!);
    addDebtor(room.value?.getMember(loggedInUser.getUserId())!);
  }
}

/**
 * Reciept upload
 */
const selectedReceiptFile = ref<File | undefined>(undefined);
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length) {
    selectedReceiptFile.value = input.files[0];
  }
};

const previewImageUrl = computed(() => {
  if (selectedReceiptFile.value) {
    return URL.createObjectURL(selectedReceiptFile.value);
  }
  return '';
});

/**
 * Analyze Receipt with ReceiptScanner
 */
const receiptAnalysing = ref(false);
const receiptAnalyseError = ref('');
watch(selectedReceiptFile, async (file) => {
  if (!file) {
    return;
  }

  receiptAnalysing.value = true;

  const scanner = new ReceiptScanner();
  const result = await scanner.scan(file);

  if (result) {
    receiptAnalyseError.value = '';
    moneyVal.value = result.getSum();
  } else {
    receiptAnalyseError.value = 'Summe nicht automatisch erkannt';
  }

  receiptAnalysing.value = false;
});
</script>

<template>
  <MainLayout>
    <!-- Submit Button (bottom right) -->
    <RoundButton
      id="submitButton"
      class="fixed bottom-5 right-5 shadow-lg z-50"
      :disabled="submitDisabled"
      :loading="submitLoading"
      @click="submit"
    >
      <i class="fa-solid fa-check"></i>
    </RoundButton>

    <!-- Form -->
    <div class="p-2 lg:p-5 flex flex-col gap-5">
      <SystemAlert v-if="submitError" severity="danger">{{ submitError }}</SystemAlert>

      <!-- Creditor -->
      <div id="toplevelCreditorDiv" class="flex flex-col items-center">
        <div
          v-if="!creditorVal"
          class="bg-gray-100 dark:bg-gray-600 p-5 rounded-lg border-gray-300 border-2 border-dashed shadow-lg"
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
                <span class="text-gray-600 dark:text-gray-200">Gläubiger*in</span>
              </div>
            </template>
          </UserDropdown>
        </div>
        <div
          v-else
          class="flex flex-col bg-gray-100 dark:bg-gray-600 p-4 rounded-lg shadow-lg items-center gap-2"
        >
          <div class="flex flex-row items-center gap-2">
            <i
              id="removeCreditor"
              class="fa-solid fa-times text-xl text-gray-500 dark:text-gray-300 cursor-pointer"
              @click="removeCreditor()"
            >
            </i>
            <UserTile :user="creditorVal" />
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">Gläubiger*in</span>
        </div>
      </div>

      <!-- Receipt upload -->
      <div class="flex flex-col items-center">
        <div
          v-if="!selectedReceiptFile"
          class="bg-gray-100 dark:bg-gray-600 p-5 rounded-lg border-gray-300 border-2 border-dashed shadow-lg"
        >
          <div
            class="flex flex-row items-center gap-2 cursor-pointer"
            onclick="document.getElementById('fileInput').click()"
          >
            <RoundButton
              class="lg:max-w-[200px]"
              title="Dokument auswählen"
              onclick="document.getElementById('fileInput').click()"
            >
              <i class="fa-solid fa-file-invoice"></i> <i class="fa-solid fa-plus"></i>
            </RoundButton>
            <div class="flex flex-col">
              <span class="dark:text-gray-300">Beleg hochladen</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">(optional)</span>
            </div>
          </div>
        </div>

        <div
          v-else
          class="flex flex-col bg-gray-100 dark:bg-gray-600 p-4 rounded-lg shadow-lg items-center gap-2"
        >
          <i
            class="fa-solid fa-trash text-red-500 cursor-pointer"
            title="Beleg entfernen"
            @click="selectedReceiptFile = undefined"
          >
          </i>
          <img
            :src="previewImageUrl"
            alt="Hochgeladener Beleg"
            class="max-h-[70svh] lg:max-w-[50vw] rounded-lg"
          />

          <div
            v-if="receiptAnalysing"
            class="flex flex-col items-center gap-2 bg-gray-700 w-full rounded-lg p-2"
          >
            <i class="fa-solid fa-spinner text-white animate-spin"></i>
            <span class="text-sm text-white">Beleg wird analysiert...</span>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">Beleg</span>
          <span v-if="receiptAnalyseError" class="text-red-600 text-sm break-words text-wrap">
            {{ receiptAnalyseError }}
          </span>
        </div>

        <input
          id="fileInput"
          type="file"
          class="hidden"
          accept="image/png, image/jpeg"
          @change="handleFileChange"
        />
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

      <div id="unevenSplitting" class="flex flex-col mt-5 w-full items-center gap-5">
        <!-- Uneven splitting -->
        <div
          v-for="debtor in debtors"
          :key="debtor.user.getUserId()"
          class="flex flex-col lg:flex-row w-full lg:max-w-[80%] gap-4 bg-gray-100 dark:bg-gray-600 p-4 rounded-lg shadow-lg"
        >
          <div class="flex flex-row gap-3 w-full lg:w-1/3 justify-between lg:justify-start">
            <UserTile :user="debtor.user" />
            <div
              class="flex flex-col lg:flex-row items-center text-center lg:order-first"
              @click="removeDebtor(debtor.user)"
            >
              <i
                class="fa-solid fa-times text-xl text-gray-500 dark:text-gray-300 cursor-pointer"
              ></i>
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
          <MoneyInputWrapper v-model="restValue[debtor.user.getUserId()]">
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
          class="flex flex-col bg-gray-100 dark:bg-gray-600 dark:text-gray-200 w-full lg:max-w-[80%] p-4 rounded-lg shadow-lg"
        >
          <span class="text-xl">
            Rest:
            <strong
              >{{ restSum >= 0 ? '' : '-' }}{{ absEurosPart(restSum) }},{{
                absCentsPart(restSum)
              }}
              €</strong
            >
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
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
