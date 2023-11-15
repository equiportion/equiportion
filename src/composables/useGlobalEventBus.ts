import {ref} from 'vue';

const bus = ref(new Map());

export default function useGlobalEventsBus() {
  function emitGlobal(event: string, ...args: any[]) {
    bus.value.set(event, args);
  }

  return {
    emitGlobal,
    bus,
  };
}
