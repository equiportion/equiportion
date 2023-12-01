<script setup lang="ts">

defineProps({
    transaction: {
        type: Object,
        required: true,
    },
})

</script>

<template>
    <div class="flex flex-col lg:flex-row mt-2 rounded-lg border-r-8 border-b-8 bg-gray-100 border-gray-200">
        <div class="flex flex-col items-center justify-center m-2">
            <p class="truncate">{{ transaction.content.purpose }}</p>
        </div>
        <div class="flex flex-col lg:items-center justify-center m-2">
            <p class="truncate">{{ transaction.content.sum }}€ gezahlt von {{ transaction.content.creditor }}</p>
        </div>
        <div class="flex flex-col lg:items-center justify-center m-2">
            <div class="flex items-center">
                <p class="truncate">Schuldner:</p>
            </div>
            <div v-for="debitor of transaction.content.debitors" :key="debitor.user">
                <p class="truncate">{{ debitor.user }}, {{ debitor.amount }}€</p>
            </div>
        </div>
    </div>
</template>