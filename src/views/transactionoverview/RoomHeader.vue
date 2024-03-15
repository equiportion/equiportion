<script setup lang="ts">
/**
 * =======================
 * Imports
 * =======================
 */
// components
import MxcOrPlaceholderImage from '@/components/media/MxcOrPlaceholderImage.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import UserBadge from '@/components/user/UserBadge.vue';
import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';

// client
import AuthenticatedMatrixClient from '@/logic/clients/AuthenticatedMatrixClient';

// models
import MRoomNameEvent from '@/logic/models/events/matrix/MRoomNameEvent';
import MRoomAvatarEvent from '@/logic/models/events/matrix/MRoomAvatarEvent';
import MRoomTopicEvent from '@/logic/models/events/matrix/MRoomTopicEvent';
import MatrixEvent from '@/logic/models/events/MatrixEvent';
import Room from '@/logic/models/Room';
import User from '@/logic/models/User';

// libraries
import {ref, watch, computed, type Ref, type PropType} from 'vue';

/**
 * =======================
 * Properties & Emits
 * =======================
 */
const props = defineProps({
  memberListOpen: {
    type: Boolean,
    required: true,
  },
  room: {
    type: Object as PropType<Room | undefined>,
    required: false,
    default: undefined,
  },
});

const emit = defineEmits(['update:memberListOpen']);

/**
 * =======================
 * Variable definitions
 * =======================
 */

/**
 * @var reference to the file input element
 */
const fileInput = ref<HTMLInputElement | null>(null);

/**
 * @var the file that was selected for the room avatar
 */
const selectedFile = ref<File | null>(null);

/**
 * @var the preview of the uploaded image (base64 encoded)
 */
const previewUploadImage: Ref<string | null> = ref(null);

/**
 * @var whether the room data should be editable (true) or not (false)
 */
const roomDataEditable = ref(false);

/**
 * @var whether the room data is currently being updated
 */
const updateRoomDataLoading = ref(false);

/**
 * @var the new room name
 */
const newRoomName = ref('');

/**
 * @var the new room topic
 */
const newRoomTopic = ref('');

/**
 * =======================
 * Computed
 * =======================
 */
// icon classes for the member list toggle button
const iconClasses = computed(() => {
  if (props.memberListOpen) {
    return 'fa-solid fa-angles-right rotate-180 transition';
  } else {
    return 'fa-solid fa-angles-right transition';
  }
});

// list of the first 3 members of the room to show their badges
const shownUserBadges = computed(() => {
  let i = 0;
  let badgeList: User[] = [];
  const members = props.room?.getMembers();
  for (const userId in members) {
    if (i < 3) {
      badgeList.push(members[userId]);
    } else {
      break;
    }
    i++;
  }
  return badgeList;
});

/**
 * =======================
 * Watchers
 * =======================
 */
// preview of the uploaded image
watch(
  () => selectedFile.value,
  () => {
    if (selectedFile.value) {
      const reader = new FileReader();
      reader.onload = () => {
        previewUploadImage.value = reader.result as string | null;
      };
      reader.readAsDataURL(selectedFile.value);
    }
  }
);

// update the new room data when the room changes
watch(
  () => props.room,
  () => {
    if (!roomDataEditable.value) {
      updateNewRoomData();
    }
  },
  {deep: true, immediate: true}
);

/**
 * =======================
 * Methods
 * =======================
 */
/**
 * Submits the new room data (name, topic, avatar) to the server.
 * @author Leandro El Omari
 * @author Philipp Stappert
 * @returns {Promise<void>} - a promise that resolves when the room data was updated
 */
async function updateRoomData(): Promise<void> {
  updateRoomDataLoading.value = true;

  if (selectedFile.value) {
    const client = AuthenticatedMatrixClient.getClient();
    try {
      const imageMxcUrl = await client.uploadFile(selectedFile.value);
      const mRoomAvatarEvent = new MRoomAvatarEvent(
        MatrixEvent.EVENT_ID_NEW,
        props.room!.getRoomId(),
        imageMxcUrl
      );
      await mRoomAvatarEvent.publish();
    } catch (error) {
      console.error(error);
    }

    previewUploadImage.value = null;
  }

  try {
    if (newRoomName.value != props.room?.getName()) {
      const mRoomNameEvent = new MRoomNameEvent(
        MatrixEvent.EVENT_ID_NEW,
        props.room!.getRoomId(),
        newRoomName.value
      );
      await mRoomNameEvent.publish();
    }
  } catch (error) {
    console.error(error);
  }

  try {
    if (newRoomTopic.value != props.room?.getTopic()) {
      const mRoomTopicEvent = new MRoomTopicEvent(
        MatrixEvent.EVENT_ID_NEW,
        props.room!.getRoomId(),
        newRoomTopic.value
      );
      await mRoomTopicEvent.publish();
    }
  } catch (error) {
    console.error(error);
  }

  roomDataEditable.value = false;
  updateRoomDataLoading.value = false;
}

/**
 * Runs if the file input changes and sets the selected file to the input value.
 * @author Philipp Stappert
 * @param {Event} event - the event that was triggered by the file input change
 * @returns {void}
 */
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length) {
    selectedFile.value = input.files[0];
  }
};

/**
 * Updates the editable room data with the current room data.
 * @author Leandro El Omari
 * @returns {void}
 */
function updateNewRoomData() {
  newRoomName.value = props.room?.getName() ?? '';
  newRoomTopic.value = props.room?.getTopic() ?? '';
}

/**
 * Toggles the room data editable state (true -> false, false -> true).
 * @author Leandro El Omari
 * @returns {void}
 */
function toggleRoomDataEditable() {
  roomDataEditable.value = !roomDataEditable.value;
}

/**
 * Toggles the member list open state (true -> false, false -> true).
 * @author Leandro El Omari
 * @returns {void}
 */
function toggleMemberList() {
  emit('update:memberListOpen', !props.memberListOpen);
}
</script>
<template>
  <div class="flex flex-col items-center lg:flex-row mt-4">
    <!-- room picture with image upload (edit mode) -->
    <div
      v-if="roomDataEditable"
      class="w-16 h-16 lg:w-32 lg:h-32 relative justify-center items-center shrink-0"
    >
      <div>
        <div
          v-if="previewUploadImage"
          alt="Hochgeladenes Bild"
          class="absolute rounded-full w-16 h-16 lg:w-32 lg:h-32 shadow-lg bg-cover bg-center"
          :style="{'background-image': `url(${previewUploadImage})`}"
        ></div>
        <MxcOrPlaceholderImage
          v-else
          :mxc-url="room?.getAvatarUrl() ?? ''"
          :placeholder-text="room?.getName() ?? '?'"
          class="absolute rounded-full w-16 h-16 lg:w-32 lg:h-32 shadow-lg"
        />
        <label
          id="uploadLabel"
          class="rounded-full lg:opacity-0 backdrop-blur-md lg:backdrop-blur-none lg:hover:backdrop-blur-md lg:hover:opacity-95 absolute w-16 h-16 lg:h-32 lg:w-32 flex justify-center items-center cursor-pointer"
          for="fileInput"
        >
          <div class="flex flex-col absolute text-center dark:text-gray-200">
            <span><i class="fa-solid fa-upload"></i></span>
            <span class="hidden lg:block">Bild hochladen</span>
          </div>
        </label>
        <input
          id="fileInput"
          ref="fileInput"
          type="file"
          accept="image/png, image/gif, image/jpeg"
          class="hidden"
          @change="handleFileChange"
        />
      </div>
    </div>

    <!-- room picture (in non-edit mode) -->
    <div v-else class="shrink-0">
      <MxcOrPlaceholderImage
        :mxc-url="room?.getAvatarUrl() ?? ''"
        :placeholder-text="room?.getName() ?? '?'"
        class="rounded-full w-16 h-16 lg:w-32 lg:h-32 shadow-lg"
      />
    </div>

    <div class="w-full">
      <!--edit mode with submit button and input fields-->
      <div
        v-if="roomDataEditable"
        class="flex flex-col items-center gap-2 lg:items-start lg:ml-4 mt-2 lg:mt-0 lg:gap-3 w-full"
      >
        <div class="flex flex-row gap-4 items-center w-full">
          <InputFieldWithLabelAndError
            id="roomName"
            v-model="newRoomName"
            class="w-full lg:max-w-[400px]"
            type="text"
            name=""
            placeholder="Name eingeben"
            label=""
          />

          <!-- submit button on large screens -->
          <RoundButton
            id="roomDataEditableSubmitLg"
            :loading="updateRoomDataLoading"
            class="shadow-lg h-8 w-8 hidden lg:block"
            @click="updateRoomData()"
          >
            <i class="fa-solid fa-check"></i>
          </RoundButton>
        </div>
        <InputFieldWithLabelAndError
          id="roomTopic"
          v-model="newRoomTopic"
          class="w-full lg:max-w-[400px]"
          type="text"
          name=""
          placeholder="Thema eingeben"
          label=""
        />
        <RoundButton
          id="roomDataEditableSubmitSm"
          :loading="updateRoomDataLoading"
          class="shadow-lg h-8 w-8 lg:hidden"
          @click="updateRoomData()"
        >
          <i class="fa-solid fa-check"></i>
        </RoundButton>
      </div>

      <!--room name and room topic (in non-edit mode )-->
      <div v-else class="flex flex-col items-center lg:items-start lg:ml-5 gap-2 lg:gap-1">
        <!-- room name if possible or the room id if not -->
        <div class="flex flex-row gap-3 items-center">
          <h1
            class="flex text-3xl font-bold text-gray-900 dark:text-gray-200 break-all items-center"
          >
            {{ room?.getName() ?? room?.getRoomId() }}
          </h1>
          <!--Change room data button-->
          <div class="shrink-0 hidden lg:block">
            <RoundButton
              id="roomDataEditableButtonLg"
              class="shadow-lg h-8 w-8"
              @click="toggleRoomDataEditable()"
            >
              <i class="fa-solid fa-pen"></i>
            </RoundButton>
          </div>
        </div>

        <span class="flex text-sm text-gray-500 dark:text-gray-400 break-all items-center lg:mb-2">
          {{ room?.getTopic() }}
        </span>

        <RoundButton
          id="roomDataEditableButtonSm"
          class="shadow-lg h-8 w-8 lg:hidden"
          @click="toggleRoomDataEditable()"
        >
          <i class="fa-solid fa-pen"></i>
        </RoundButton>

        <div
          id="memberBadgesList"
          class="flex flex-row gap-2 justify-center lg:justify-start flex-wrap"
        >
          <!--shows the display names of all members in a room if possible or the member id if not-->
          <template v-for="member in shownUserBadges" :key="member.getUserId()">
            <UserBadge v-show="member.getUserId() != ''" :user="member" class="shadow-md" />
          </template>
          <span v-if="Object.keys(room?.getMembers() ?? {}).length > 3">...</span>

          <RoundButton
            id="toggleMemberListButton"
            class="w-8 h-8 shadow-md"
            @click="toggleMemberList()"
          >
            <i :class="iconClasses"></i>
          </RoundButton>
        </div>
      </div>
    </div>
  </div>
</template>
