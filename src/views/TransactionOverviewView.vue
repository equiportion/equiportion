<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import ProfileImage from '@/components/media/ProfileImage.vue';
import TransactionTile from '@/views/partials/TransactionTile.vue';
import NewTransactionButton from '@/components/buttons/NewTransactionButton.vue'

const transaction1 = {
    "content": {
        "purpose": "Pizzaessen",
        "sum": 8,
        "creditor": "@example5:example.org",
        "debitors": [
            {
                "user": "@example3:example.org",
                "amount": 2.14
            },
            {
                "user": "@example7:example.org",
                "amount": 2.96
            },
            {
                "user": "@example11:example.org",
                "amount": 2.90
            }
        ]
    },
    "event_id": "$14327358244PhrSn:example.org",
    "origin_server_ts": 1432735824653,
    "room_id": "!636q39766251:matrix.org",
    "sender": "@example:example.rg",
    "type": "edu.kit.kastel.dsn.pse.transaction",
    "unsigned": {
        "age": 1234
    }
}

const transaction2 = {
    "content": {
        "purpose": "Einkauf",
        "sum": 20,
        "creditor": "@example5:example.org",
        "debitors": [
            {
                "user": "@example3:example.org",
                "amount": 2.14
            },
            {
                "user": "@example7:example.org",
                "amount": 2.96
            }
        ]
    },
    "event_id": "$14327358244PhrSn:example.org",
    "origin_server_ts": 1432735824653,
    "room_id": "!636q39766251:matrix.org",
    "sender": "@example:example.rg",
    "type": "edu.kit.kastel.dsn.pse.transaction",
    "unsigned": {
        "age": 1234
    }
}

const transactionList = [transaction1, transaction2];

</script>

<template>
    <MainLayout>
        <div class="flex flex-col px-5 items-center">
            <div class="flex w-1/6"></div>
            <div class="flex flex-col w-4/6">
                <!--Profile image and username -->
                <div class="flex h-40 flex-col items-center lg:flex-row mt-4">
                    <ProfileImage class="w-32 h-32 rounded-full ml-4" />
                    <div class="flex flex-col items-center lg:items-start ml-4 gap-5">
                        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">PSE</h1>
                        <span> Max Muster, Maxi Muster, Maximilian Muster, ...</span>
                    </div>
                </div>
                <div class="flex flex-col">

                    <!--default message-->
                    <template v-if="transactionList.length <= 0">
                        <div class="flex flex-col text-sm text-gray-300 items-center mt-5">
                            <div>Keine Transaktionen vorhanden</div>
                        </div>
                    </template>

                    <!--Transaction Tile-->
                    <template v-for="transaction in transactionList" :key="transaction.id">
                        <TransactionTile :transaction="transaction"/>
                    </template>

                    <!--Plus button-->
                    <NewTransactionButton ></NewTransactionButton>
                </div>
            </div>
            <div class="flex w-1/6"></div>    
        </div>
    </MainLayout>
</template>