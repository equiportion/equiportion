<script setup lang="ts">
import {computed, ref, watch, type Ref, type PropType} from 'vue';

import ModalDialog from '@/components/modals/ModalDialog.vue';
import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';
import StandardButton from '@/components/buttons/StandardButton.vue';
import AuthenticatedMatrixClient from '@/logic/clients/AuthenticatedMatrixClient';
import User from '@/logic/models/User';
import UserTile from '@/components/user/UserTile.vue';
import regularExpressions from '@/logic/constants/regularExpressions';
import Room from '@/logic/models/Room';

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

const modalOpen = computed({
  get: () => props.open,
  set: (val) => {
    emit('update:open', val);
  },
});

const userId = ref('');
const userIdError = ref('');

const inviteLoading = ref(false);
const inviteSuccess = ref(false);

/**
 * User Autocomplete
 */
const client = AuthenticatedMatrixClient.getClient();
const autoCompleteUsers: Ref<User[]> = ref([]);
watch(
  () => userId.value,
  async (val) => {
    if (val.length > 2 && !userIdValid.value) {
      const users = await client.searchUsers(val, 6);
      autoCompleteUsers.value = users;
    } else {
      autoCompleteUsers.value = [];
    }
  }
);

const userIdValid = computed(() => {
  const re = new RegExp(regularExpressions.userId);
  return re.test(userId.value);
});

/**
 * Send invitation
 */
async function sendInvitation() {
  if (!userIdValid.value) {
    userIdError.value = 'Ungültige Benutzer-ID';
    return;
  }

  if (!props.room) {
    console.error('Raum wurde noch nicht vollständig geladen...');
    return;
  }

  inviteLoading.value = true;

  const success = await props.room.inviteUser(userId.value);

  inviteLoading.value = false;
  if (success) {
    userId.value = '';
    userIdError.value = '';
    inviteSuccess.value = true;

    setTimeout(() => {
      inviteSuccess.value = false;
    }, 3000);
  } else {
    userIdError.value =
      'Einladung fehlgeschlagen: Bitte prüfe, ob der/die Benutzer*in existiert (und noch nicht in diesem Raum ist) und ob du die Berechtigung hast, ihn/sie einzuladen.';
  }
}
</script>
<template>
  <ModalDialog v-model:open="modalOpen">
    <h3 class="font-bold text-xl grow">
      <i class="fa-solid fa-user-plus"></i> In diesen Raum einladen
    </h3>
    <div class="flex flex-col items-center gap-2">
      <InputFieldWithLabelAndError
        id="inputFieldForUserInvitation"
        v-model="userId"
        label="Matrix-ID"
        type="text"
        :error="userIdError"
        name="username"
        placeholder="z.B. @maxmustermann:matrix.org"
        class="flex-grow w-full"
      />
      <div v-show="autoCompleteUsers.length > 0 && !userIdValid" class="flex flex-col gap-2 w-full">
        <span class="text-sm text-gray-500">Vorschläge:</span>
        <div
          v-for="user in autoCompleteUsers"
          :key="user.getUserId()"
          class="flex items-center gap-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer no-close"
          @click="userId = user.getUserId()"
        >
          <div class="flex-grow">
            <UserTile :user="user" />
          </div>
          <div>
            <i class="fa-solid fa-turn-up"></i>
          </div>
        </div>
      </div>
      <StandardButton
        id="invitationSubmit"
        :disabled="!userIdValid && !inviteSuccess"
        :success="inviteSuccess"
        :loading="inviteLoading"
        @click="sendInvitation()"
      >
        <i class="fa-solid fa-paper-plane"></i> einladen
      </StandardButton>
    </div>
  </ModalDialog>
</template>
