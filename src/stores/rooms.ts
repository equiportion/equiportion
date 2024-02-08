import type Room from '@/logic/models/Room';
import {defineStore} from 'pinia';
import {ref, type Ref} from 'vue';

export const useRoomsStore = defineStore('rooms', () => {
  const joinedRooms: Ref<{[roomId: string]: Room}> = ref({});
  const invitedRooms: Ref<{[roomId: string]: Room}> = ref({});

  /**
   * Get a (joined) room by its roomId.
   * @param {string} roomId the matrix-room-id of the room
   * @returns {Room | undefined} the room if it exists, else undefined
   */
  function getRoom(roomId: string): Room | undefined {
    return joinedRooms.value[roomId];
  }

  return {joinedRooms: joinedRooms, invitedRooms: invitedRooms, getRoom};
});
