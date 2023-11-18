<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import User from '@/logic/models/User';
import Room from '@/logic/models/Room';
import { ref } from "vue";


const providers:string[] = ["Paypal", "IBAN"];
const value = ref('');

const room1:Room = new Room("", "", "", "");
const room2:Room = new Room("", "", "", "");
const rooms:Room[] = [room1, room2];
const map:Map<string, string> = new Map();
map.set("Paypal", "my-paypal");
map.set("IBAN", "my-iban");
const user:User = new User("", "", "", map, rooms);

function getPaymentInformationPlaceholder(provider:string): string {
    return user.getPaymentInformation(provider);
}

function setPaymentInformationPlaceholder(provider:string, value:string) {
  user.setPaymentInformation(provider, value);  
}

</script>
<template>
    <MainLayout>
      <div class="bg-gray-50">
      <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Bezahldaten Einstellungen</h1>
        <p class="mt-1.5 text-sm text-gray-500">
          hinterlege hier deine Daten, über die dich andere Nutzer ausbezahlen können
        </p>
      </div>
    </div>
    
    <!--begin payment information overview-->
    <div class="flex flex-row w-full lg:max-w-[80%] gap-2 p-5 rounded-lg border-r-8 border-b-8 bg-gray-100 border-gray-200">
      <div class="flex flex-col flex-grow gap-2">
        <div class="flex flex-row justify-center flex-grow gap-2" v-for="provider in providers" :key="provider">
          <div class ="flex flex-column justify-center flex-grow gap-2">
            <span class="font-semibold">{{ provider }}</span>
            <input type="text" :placeholder="getPaymentInformationPlaceholder(provider)" v-model="value">
            {{ setPaymentInformationPlaceholder(provider, value) }}
          </div>
        </div>     
      </div>
    </div>
    <!--end payment information overview-->
  </MainLayout>
</template>