<script setup lang="ts">
/**
 * =======================
 * Imports
 * =======================
 */
// components
import RoundButton from '@/components/buttons/RoundButton.vue';
import UserTile from '@/components/user/UserTile.vue';
import BalanceSpan from '@/views/transactionoverview/BalanceSpan.vue';
import DropdownMenu from '@/components/dropdowns/DropdownMenu.vue';
import DropdownButton from '@/components/dropdowns/DropdownButton.vue';
import InviteModal from '@/views/transactionoverview/InviteModal.vue';

// client
import AuthenticatedMatrixClient from '@/logic/clients/AuthenticatedMatrixClient';

// models
import Room from '@/logic/models/Room';

//compensation
import BipartiteCompensation from '@/logic/compensation/BipartiteCompensation';

// stores
import {useLoggedInUserStore} from '@/stores/loggedInUser';

// framework and libraries
import {ref, watch, type PropType, type Ref} from 'vue';
import router from '@/router';

/**
 * =======================
 * Properties & Emits
 * =======================
 */
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  room: {
    type: Object as PropType<Room | undefined>,
    required: false,
    default: undefined,
  },
});

const emit = defineEmits(['update:open']);

/**
 * =======================
 * Variables,
 * data from stores
 * =======================
 */

/**
 * @var whether the invite modal is open (true) or not (false)
 */
const inviteModalOpen = ref(false);

/**
 * @var the logged in user
 */
const loggedInUser = useLoggedInUserStore().user;

/**
 * @var the compensation for each user in the room relative to the logged in user (positive values means that the user gets money from the logged in user)
 */
const compensation: Ref<{[userId: string]: number}> = ref({});

/**
 * =======================
 * Watchers
 * =======================
 */
// watch for changes in the room
watch(
  () => props.room,
  () => {
    updateCompensation();
  },
  {immediate: true, deep: true}
);

/**
 * =======================
 * Methods
 * =======================
 */
/**
 * Updates/Generates the required compensation for each user in the room.
 * @author Philipp Stappert
 * @returns void
 */
function updateCompensation() {
  if (!props.room) {
    return;
  }

  // calculate the compensation for each user via an given compensation algorithm (specific implementation of ICompensationAlgorithm)
  const compensationCalculation = new BipartiteCompensation();
  compensation.value = compensationCalculation.calculateCompensation(props.room!);
}

/**
 * Toggles the member list.
 * @author Philipp Stappert
 * @returns void
 */
function toggleMemberList() {
  emit('update:open', !props.open);
}

/**
 * Toggle the modal to invite a user to the room.
 * @author Philipp Stappert
 * @returns void
 */
function toggleInviteModal(): void {
  inviteModalOpen.value = !inviteModalOpen.value;
}

/**
 * Leave the room.
 * Ask for confirmation and leave the room if confirmed.
 * @author Philipp Stappert
 * @returns Promise<void>
 */
async function leaveRoom(): Promise<void> {
  // ask for confirmation
  if (!confirm('Möchtest du den Raum wirklich verlassen?')) {
    return;
  }

  // run the leave room api call
  const client = AuthenticatedMatrixClient.getClient();
  const success = await client.leaveRoom(props.room!.getRoomId());

  // notify the user about the result
  if (!success) {
    alert('Fehler beim Verlassen des Raums! Bitte probiere es später erneut.');
  } else {
    router.push({name: 'home'});
  }
}

/**
 * Kick a user from the room.
 * @author Philipp Stappert
 * @param userId - the user id of the user to kick
 * @returns Promise<void> - a promise that resolves when kick api call is done
 */
async function kickUser(userId: string) {
  const success = await props.room!.kickUser(userId);

  if (!success) {
    alert('Fehler beim Kicken des Mitglieds. Bitte prüfe, ob du die nötigen Rechte hast!');
  }
}

/**
 * Redirect to the new transaction page (which is then prefilled with the corresponding data for a compensation of this user).
 * @author Jörn Mihatsch
 * @param compensation - the compensation amount (in cents)
 * @param userId - the user id of the user to compensate
 * @returns void
 */
function redirectToCompensationPayment(compensation: number, userId: string) {
  if (!compensation) {
    return;
  }

  // store the compensation amount and the user id in the session storage to retrieve it in the new transaction page
  sessionStorage.setItem('compensation', compensation.toString());
  sessionStorage.setItem('compensation_userId', userId);

  // redirect to the new transaction page
  router.push({
    name: 'new-transaction',
    params: {roomId: props.room!.getRoomId()},
  });
}
</script>
<template>
  <!--modal for inviting user-->
  <InviteModal v-model:open="inviteModalOpen" :room="room" />

  <!--Member list-->
  <div
    v-show="open"
    id="memberList"
    class="flex flex-col flex-grow w-full lg:w-1/3 shadow-lg rounded-tl-lg rounded-bl-lg transition bg-gray-100 dark:bg-gray-700 my-5 p-5 gap-5"
  >
    <!-- Header -->
    <div class="flex flex-row items-center justify-between">
      <RoundButton class="w-8 h-8 shrink-0 shadow-md" @click="toggleMemberList()">
        <i class="fa-solid fa-angles-right"></i>
      </RoundButton>
      <RoundButton
        id="addMemberButton"
        class="w-8 h-8 shrink-0 shadow-md"
        @click="toggleInviteModal()"
      >
        <i class="fa-solid fa-user-plus text-sm"></i>
      </RoundButton>
    </div>

    <!-- List of users -->
    <div id="userTiles" class="flex flex-col gap-2">
      <!-- current user -->
      <div class="flex items-center bg-gray-300 dark:bg-gray-500 p-2 rounded-lg">
        <UserTile :user="room?.getMember(loggedInUser.getUserId())!" class="w-full" />

        <button class="text-red-600 dark:text-red-500" title="Raum verlassen" @click="leaveRoom()">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>

      <!-- all current room members-->
      <template v-for="member in room?.getMembers()" :key="member.getUserId()">
        <div
          v-show="member.getUserId() != ''"
          v-if="member.getUserId() != loggedInUser.getUserId()"
          class="flex items-center bg-gray-300 dark:bg-gray-500 p-2 rounded-lg"
        >
          <div class="flex flex-col items-center gap-1 w-full">
            <UserTile :user="member" class="w-full" />
            <BalanceSpan :compensation="compensation[member.getUserId()]" />
          </div>

          <!-- dropdown menu for banning and creating compensation payments -->
          <DropdownMenu>
            <template #trigger>
              <i class="fa-solid fa-ellipsis-vertical px-2 dark:text-gray-200"></i>
            </template>

            <DropdownButton
              v-show="compensation[member.getUserId()]"
              @click="
                redirectToCompensationPayment(compensation[member.getUserId()], member.getUserId())
              "
            >
              <i class="fa-solid fa-money-bill-transfer"></i>
              <span>Ausgleichs-Transaktion erstellen</span>
            </DropdownButton>

            <DropdownButton @click="kickUser(member.getUserId())">
              <i class="fa-solid fa-user-slash text-red-600"></i>
              <span class="grow text-red-600">Mitglied kicken</span>
            </DropdownButton>
          </DropdownMenu>
        </div>
      </template>

      <!--invited members-->
      <div
        v-if="room?.getMembers(['invite']) && Object.keys(room!.getMembers(['invite'])).length > 0"
        class="opacity-50"
      >
        <span class="text-sm text-gray-800 dark:text-gray-200 items-center">Eingeladen</span>
        <div
          v-for="member in room!.getMembers(['invite'])"
          :key="member.getUserId()"
          class="flex flex-col items-center gap-1 bg-gray-300 dark:bg-gray-500 p-2 rounded-lg mb-2"
        >
          <UserTile :user="member" class="w-full" />
        </div>
      </div>

      <!--left members-->
      <div
        v-if="room?.getMembers(['left']) && Object.keys(room!.getMembers(['left'])).length > 0"
        class="opacity-50"
      >
        <span class="text-sm text-gray-800 dark:text-gray-200 items-center"
          >Ehemalige Mitglieder</span
        >
        <div
          v-for="member in room!.getMembers(['left'])"
          :key="member.getUserId()"
          class="flex flex-col items-center gap-1 bg-gray-300 dark:bg-gray-500 p-2 rounded-lg mb-2"
        >
          <UserTile :user="member" class="w-full" />
          <BalanceSpan :compensation="compensation[member.getUserId()]" />
        </div>
      </div>
    </div>
  </div>
</template>
